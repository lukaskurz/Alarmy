/**
 * Format of the messages being published to the mqtt-broker
 */
export class MqttMessage{
    public constructor(public Type:number, public Timestamp:Date, public Content:string, public Topic:string){}
}