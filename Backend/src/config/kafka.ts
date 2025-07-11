import { Kafka, Consumer, Producer } from 'kafkajs';
import { logger } from '../utils/logger';

const KAFKA_BROKER = process.env.KAFKA_BROKER || 'localhost:9092';
const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID || 'devboard-api';

let kafka: Kafka;
let producer: Producer;
let consumer: Consumer;

export async function connectToKafka(): Promise<void> {
  try {
    // Initialize Kafka client
    kafka = new Kafka({
      clientId: KAFKA_CLIENT_ID,
      brokers: [KAFKA_BROKER],
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    // Initialize producer
    producer = kafka.producer({
      maxInFlightRequests: 1,
      idempotent: true,
      transactionTimeout: 30000,
    });

    // Initialize consumer
    consumer = kafka.consumer({
      groupId: 'devboard-consumer-group',
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
    });

    // Connect producer and consumer
    await producer.connect();
    await consumer.connect();

    logger.info('✅ Connected to Kafka');

    // Handle process termination
    process.on('SIGINT', async () => {
      await producer.disconnect();
      await consumer.disconnect();
      logger.info('Kafka connections closed through app termination');
    });

  } catch (error) {
    logger.error('Failed to connect to Kafka:', error);
    throw error;
  }
}

export function getKafkaProducer(): Producer {
  if (!producer) {
    throw new Error('Kafka producer not initialized. Call connectToKafka() first.');
  }
  return producer;
}

export function getKafkaConsumer(): Consumer {
  if (!consumer) {
    throw new Error('Kafka consumer not initialized. Call connectToKafka() first.');
  }
  return consumer;
}

// Kafka service for event streaming
export class KafkaService {
  private producer: Producer;
  private consumer: Consumer;

  constructor() {
    this.producer = getKafkaProducer();
    this.consumer = getKafkaConsumer();
  }

  async publishEvent(topic: string, event: any): Promise<void> {
    try {
      await this.producer.send({
        topic,
        messages: [
          {
            key: event.userId || 'system',
            value: JSON.stringify({
              ...event,
              timestamp: new Date().toISOString(),
            }),
          },
        ],
      });
      
      logger.info(`Event published to topic ${topic}:`, event);
    } catch (error) {
      logger.error('Failed to publish event:', error);
      throw error;
    }
  }

  async subscribeToTopic(topic: string, callback: (event: any) => void): Promise<void> {
    try {
      await this.consumer.subscribe({ topic, fromBeginning: false });
      
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const event = JSON.parse(message.value?.toString() || '{}');
            logger.info(`Event received from topic ${topic}:`, event);
            callback(event);
          } catch (error) {
            logger.error('Error processing message:', error);
          }
        },
      });
    } catch (error) {
      logger.error('Failed to subscribe to topic:', error);
      throw error;
    }
  }

  async publishUserActivity(userId: string, activity: any): Promise<void> {
    await this.publishEvent('user-activity', {
      userId,
      ...activity,
    });
  }

  async publishGitHubActivity(userId: string, activity: any): Promise<void> {
    await this.publishEvent('github-activity', {
      userId,
      ...activity,
    });
  }

  async publishAIInsight(userId: string, insight: any): Promise<void> {
    await this.publishEvent('ai-insight', {
      userId,
      ...insight,
    });
  }

  async publishNotification(userId: string, notification: any): Promise<void> {
    await this.publishEvent('notification', {
      userId,
      ...notification,
    });
  }

  async publishAchievement(userId: string, achievement: any): Promise<void> {
    await this.publishEvent('achievement', {
      userId,
      ...achievement,
    });
  }
}

export const kafkaService = new KafkaService();
