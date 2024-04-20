'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addProduct } from '@/actions/products';

const schema = z.object({
    name: z.string().nonempty(),
    price: z.coerce.number().positive().lt(100),
});

export default function AddProductPage(): ReactNode {
    const {
        register,
        formState: { errors, isSubmitting },
        handleSubmit,
    } = useForm<z.TypeOf<typeof schema>>({
        resolver: zodResolver(schema),
        mode: 'all',
    });

    return (
        <form
            className="w-2/5 mx-auto mt-4 bg-gray-200 p-4"
            action={handleSubmit(addProduct) as unknown as () => void}
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
