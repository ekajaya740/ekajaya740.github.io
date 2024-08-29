import axios from 'axios';
import { MultiContactSchema } from '../schemas/contact';

export async function getContacts() {
  const { data } = await axios.get('/contact/contacts.json');

  const pData = MultiContactSchema.parse(data);

  return pData;
}
