import TransferForm from '../TransferForm';

export const metadata = {
  title: 'Add New Transfer | Admin',
};

export default function NewTransferPage() {
  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="admin-header">
        <h1 className="font-serif">Add New Transfer</h1>
      </div>
      <TransferForm />
    </div>
  );
}
