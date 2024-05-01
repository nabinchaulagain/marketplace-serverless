'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type z } from 'zod';
import { addProduct } from '@/actions/products';
import { addProductSchema } from '@/schemas/products';
import { toBase64 } from '@/utils/file';

export default function AddProductPage(): ReactNode {
    const {
        register,
        formState: { errors, isSubmitting },
        handleSubmit,
    } = useForm<z.TypeOf<typeof addProductSchema>>({
        resolver: zodResolver(addProductSchema),
        mode: 'all',
    });
    const submit = handleSubmit(async (formValues) => {
        const image = formValues.image.item(0);

        if (!image) {
            return;
        }

        await addProduct({
            ...formValues,
            image: {
                base64EncodedContent: await toBase64(image),
                name: image.name,
            },
        });
    });

    return (
        <form
            className="w-2/5 mx-auto mt-4 bg-gray-200 p-4"
            action={submit as unknown as () => void}
        >
            <h1 className="text-center text-2xl mb-4">Add product</h1>
            <div className="mb-4">
                <Input placeholder="Product name" {...register('name')} />
                {errors.name && (
                    <div className="text-xs text-red-400 mt-1">
                        {errors.name.message}
                    </div>
                )}
            </div>
            <div className="mb-4">
                <Input type="file" {...register('image')} />
                {errors.image && (
                    <div className="text-xs text-red-400 mt-1">
                        {errors.image.message}
                    </div>
                )}
            </div>
            <div className="mb-4">
                <Input
                    type="number"
                    placeholder="Price (in USD)"
                    {...register('price')}
                />
                {errors.price && (
                    <div className="text-xs text-red-400 mt-1">
                        {errors.price.message}
                    </div>
                )}
            </div>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add'}
            </Button>
        </form>
    );
}
