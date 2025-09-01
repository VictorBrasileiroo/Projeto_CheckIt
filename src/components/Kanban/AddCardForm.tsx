
import React, { useState } from 'react';

interface AddCardFormProps {
  onAdd: (title: string, description: string) => void;
}

const AddCardForm: React.FC<AddCardFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), description.trim());
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        className="border rounded p-2 w-full mb-2"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="border rounded p-2 w-full mb-2"
        placeholder="Descrição (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      ></textarea>
      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        type="submit"
      >
        Adicionar
      </button>
    </form>
  );
};

export default AddCardForm;
