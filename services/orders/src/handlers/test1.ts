async function test1(event: any): Promise<any> {
    console.log({ event });
    return event;
}

export const handler = test1;
