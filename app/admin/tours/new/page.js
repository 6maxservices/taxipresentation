import TourForm from '../TourForm';

export const metadata = {
  title: 'Add New Tour | Admin',
};

export default function NewTourPage() {
  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="admin-header">
        <h1 className="font-serif">Add New Tour</h1>
      </div>
      <TourForm />
    </div>
  );
}
