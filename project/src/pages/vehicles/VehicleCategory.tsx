import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { vehicleCategoryAPI, VehicleCategoryDTO } from '../../services/api';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { DataTable } from '../../components/common/DataTable';
import { Icon } from '../../components/ui/Icon';

const categorySchema = z.object({
	name: z.string().min(2, 'Name is required'),
	description: z.string().optional(),
});

type CategoryForm = z.infer<typeof categorySchema>;

export const VehicleCategoryPage: React.FC = () => {
	const navigate = useNavigate();
	const [vehicleCategories, setVehicleCategories] = React.useState<VehicleCategoryDTO[]>([]);
	const [loading, setLoading] = React.useState(false);

	const load = React.useCallback(async () => {
		setLoading(true);
		try { setVehicleCategories(await vehicleCategoryAPI.list()); } finally { setLoading(false); }
	}, []);

	React.useEffect(() => { load(); }, [load]);

	const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CategoryForm>({
		resolver: zodResolver(categorySchema),
	});

		const onSubmit = async (data: CategoryForm) => {
			await vehicleCategoryAPI.create({ name: data.name.trim(), description: data.description });
			toast.success('Category added');
			reset({ name: '', description: '' });
			await load();
		};

			const columns: { key: keyof VehicleCategoryDTO; header: string; render?: (row: VehicleCategoryDTO) => React.ReactNode }[] = [
				{ key: 'name', header: 'Name' },
				{ key: 'description', header: 'Description', render: (row: VehicleCategoryDTO) => row.description || '-' },
				{ key: 'createdAt', header: 'Created', render: (row: VehicleCategoryDTO) => new Date(row.createdAt).toLocaleString() },
			];

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-3">
					<Button variant="outline" onClick={() => navigate('/vehicles')}>
						<Icon name="back" className="h-4 w-4 mr-2" /> Back
					</Button>
					<h1 className="text-3xl font-bold text-gray-900">Vehicle Category</h1>
				</div>
					<Button variant="outline" onClick={load}>
							<Icon name="filter" className="h-4 w-4 mr-2" /> Refresh
				</Button>
			</div>

			<Card>
				<CardHeader>
					<h2 className="text-xl font-semibold text-gray-900">Add New Category</h2>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
						<Input label="Name" placeholder="e.g. Sedan" {...register('name')} error={errors.name?.message} />
						<Input label="Description" placeholder="Optional" {...register('description')} />
						<Button type="submit" loading={isSubmitting}>Add Category</Button>
					</form>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<h2 className="text-xl font-semibold text-gray-900">Categories</h2>
				</CardHeader>
				<CardContent>
								{loading ? (
									<div className="p-6 text-sm text-gray-500">Loading...</div>
								) : (
									<DataTable data={vehicleCategories} columns={columns} searchPlaceholder="Search categories..." />
								)}
				</CardContent>
			</Card>
		</div>
	);
};

export default VehicleCategoryPage;
