import {
  SNSClient,
  CreateTopicCommand,
  PublishCommand,
} from "@aws-sdk/client-sns";
import { v4 as uuidv4 } from "uuid";
import { logger } from ".";

export class PubSub {
  private snsClient: SNSClient;

  constructor() {
    if (process.env.NODE_ENV == "development") {
      this.snsClient = new SNSClient({
        region: "ap-southeast-1",
        credentials: {
          accessKeyId: `${process.env.ACCESS_KEY_ID}`,
          secretAccessKey: `${process.env.SECRET_KEY_ID}`,
        },
      });
    } else {
      this.snsClient = new SNSClient({
        region: "ap-southeast-1",
      });
    }
  }

  /**
   * Publishes the booking info to SNS topic.
   * @param bookingUUID The user's booking uuid.
   * @param venue The full address of the booking venue.
   * @param bookingStatus The status of the booking.
   * @param startTime The booking's start time.
   * @param endTime The booking's end time.
   * @param eventType Filters the messages a subscriber will receive.
   * @param bookingTitle The title of the booking.
   * @param pocPhone The user's phone number.
   * @param pocEmail The user's email.
   * @param optionalAttribute Use this to pass an additional attribute.
   * @returns
   */
  public async publishSpaceBookings(
    bookingUUID: string,
    venue: string,
    bookingStatus: string,
    date: string,
    checkInStatus: string | boolean,
    startTime: string,
    endTime: string,
    eventType: string,
    bookingTitle?: string,
    pocPhone?: string,
    pocEmail?: string,
    optionalAttribute?: string
  ) {
    // if publishing fails, should fail gracefully without affecting main service.
    try {
      const topic = process.env.SPACE_BOOKING_SNS_TOPIC;
      const bookingInfo = {
        bookingUUID,
        venue,
        bookingStatus,
        date,
        checkInStatus,
        startTime,
        endTime,
        bookingTitle,
        pocPhone,
        pocEmail,
      };
      const message = JSON.stringify(bookingInfo);

      const messageGroupId = bookingUUID;
      const createTopicCommand = new CreateTopicCommand({
        Name: topic,
        Attributes: {
          FifoTopic: "true",
        },
      });
      const createTopicResponse = await this.snsClient.send(createTopicCommand);
      const { TopicArn } = createTopicResponse;

      const publishCommand = new PublishCommand({
        Message: message,
        TopicArn,
        MessageAttributes: {
          event_type: {
            DataType: "String",
            StringValue: eventType,
          },
          ...(optionalAttribute
            ? {
                optional: {
                  DataType: "String",
                  StringValue: optionalAttribute,
                },
              }
            : null),
        },
        MessageDeduplicationId: uuidv4(),
        MessageGroupId: messageGroupId,
      });
      const publishResponse = await this.snsClient.send(publishCommand);
      return publishResponse;
    } catch (error) {
      logger.logger.error(error);
    }
  }
}
