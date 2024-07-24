import { Chip } from '@nextui-org/react';

export default function LanguagesList() {
  return (
    <div className='flex flex-wrap justify-center gap-3'>
      <Chip size='lg' color='danger' variant='faded' startContent={<p>🇮🇩</p>}>
        Indonesia
      </Chip>
      <Chip size='lg' color='primary' variant='faded' startContent={<p>🇬🇧</p>}>
        English
      </Chip>
    </div>
  );
}
