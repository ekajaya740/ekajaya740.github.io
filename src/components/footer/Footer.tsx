export default function Footer() {
  return (
    <div className='border-t border-black py-4 w-full'>
      <p className='text-center font-light'>
        Copyright © {new Date(Date.now()).getFullYear()} I Putu Ekajaya Awidya
        Putra
      </p>
    </div>
  );
}
