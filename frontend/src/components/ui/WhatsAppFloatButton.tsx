const WHATSAPP_PHONE = '+2348102544186' 
const DEFAULT_MESSAGE = 'Hello%20Haliberry%20Cake%2C%20I%20would%20like%20to%20make%20an%20enquiry%20about%20your%20cakes%2Fclasses.'

export default function WhatsAppFloatButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_PHONE}?text=${DEFAULT_MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className="fixed bottom-8 right-6 z-50 md:bottom-10 inline-flex items-center gap-3 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-[0_24px_45px_rgba(37,211,102,0.18)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#1ebe5a] focus:outline-none focus:ring-4 focus:ring-[#25d366]/30"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#25D366] shadow-sm">
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
          <path d="M20.52 3.48A11.88 11.88 0 0012.06.12C5.59.12.48 5.22.48 11.69c0 2.05.55 4.05 1.6 5.8L.12 23.7l6.4-1.68a11.65 11.65 0 005.54 1.38h.01c6.47 0 11.58-5.11 11.58-11.58a11.81 11.81 0 00-3.04-8.84zM12.06 21.5h-.01a10.24 10.24 0 01-5.23-1.43l-.37-.22-3.79.99.98-3.7-.24-.38A10.31 10.31 0 011.7 11.7c0-5.65 4.6-10.26 10.26-10.26 2.74 0 5.32 1.07 7.26 3.02a10.24 10.24 0 013.02 7.25c0 5.65-4.6 10.26-10.25 10.26zm5.63-7.34c-.31-.16-1.83-.9-2.12-1.01-.29-.11-.5-.16-.71.16s-.82 1.01-1 1.22c-.18.2-.36.23-.67.08-.31-.16-1.34-.49-2.55-1.57-.94-.84-1.57-1.88-1.75-2.19-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.54.15-.18.2-.31.3-.52.1-.21.05-.39-.02-.54-.07-.16-.71-1.72-.97-2.36-.26-.62-.52-.54-.71-.55-.18-.01-.39-.01-.6-.01-.21 0-.55.08-.84.39-.29.31-1.12 1.1-1.12 2.68 0 1.58 1.15 3.11 1.31 3.33.16.21 2.26 3.45 5.48 4.83.77.33 1.37.53 1.84.68.77.25 1.47.21 2.02.13.62-.09 1.83-.75 2.08-1.48.25-.73.25-1.35.18-1.48-.07-.12-.28-.19-.58-.35z" />
        </svg>
      </span>
      <span className="hidden sm:inline">WhatsApp Enquiry</span>
    </a>
  )
}
