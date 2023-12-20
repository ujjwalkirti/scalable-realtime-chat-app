import { Kafka, Producer } from "kafkajs";
import dotenv from 'dotenv';
import { readFileSync } from "fs";
import path from "path";
import prismaClient from "./prisma";
dotenv.config();


const kafka_url = process.env.KAFKA_HOST as string + ":" + process.env.KAFKA_PORT?.toString();
const kafka = new Kafka({
    brokers: [kafka_url],
    ssl: {
        ca: [readFileSync(path.resolve(
            './ca.pem'
        ), "utf-8")]
    },
    sasl: {
        username: process.env.KAFKA_USERNAME as string,
        password: process.env.KAFKA_PASSWORD as string,
        mechanism: 'plain'
    }
})

let producer: null | Producer = null;

async function createProducer() {
    if (producer) return producer;

    const _producer = kafka.producer()
    await _producer.connect()
    producer = _producer;
    return producer
}

export async function produceMessage(message: string) {
    const producer = await createProducer();

    await producer.send({
        messages: [{ key: `message-${Date.now()}`, value: message }],
        topic: 'MESSAGES'
    })
    return true;
}

export async function startMessageConsumer() {
    const consumer = kafka.consumer({ groupId: 'default' });
    await consumer.connect();
    await consumer.subscribe({ topic: 'MESSAGES', fromBeginning: true });
    await consumer.run({
        autoCommit: true,
        eachMessage: async ({ topic, partition, message, pause }) => {
            if (!message.value) return;
            console.log('New msg rec.')
            try {
                await prismaClient.message.create({
                    data: {
                        text: message.value?.toString()
                    }
                })
            } catch (error) {
                console.log('Something went wrong...')
                pause();
                setTimeout(() => {
                    console.log('Resuming...')
                    consumer.resume([{ topic }]);
                }, 60 * 1000);
            }
        }
    })
}

export { createProducer };

export default kafka;
