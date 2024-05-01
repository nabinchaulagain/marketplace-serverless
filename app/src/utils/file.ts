export async function toBase64(file: File): Promise<string> {
    return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (!reader.result) {
                reject(new Error('Invalid file'));
            }
            resolve((reader.result as string)?.split(',')[1]);
        };
        reader.onerror = reject;
    });
}
