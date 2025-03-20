import { Phone, Mail, Facebook, Instagram, Twitter, MapPinned } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto py-6 px-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Company Information */}
                <div className="border-b-2 border-gray-600 pb-2">
                    <h3 className="text-md font-bold mb-2 text-teal-400">Head Office</h3>
                    {/* <p className="text-sm">Savar, Dhaka</p> */}

                    <p className="mt-2 flex items-center text-sm">
                        <MapPinned className="mr-2 text-teal-400" /> Savar, Dhaka
                    </p>

                    <p className="mt-2 flex items-center text-sm">
                        <Phone className="mr-2 text-teal-400" /> Hotline: 01302878372
                    </p>
                    <p className="flex items-center text-sm">
                        <Mail className="mr-2 text-teal-400" /> E-mail: mystylebd.contact@gmail.com
                    </p>
                </div>

                {/* Courier Partners */}
                <div className="border-b-2 border-gray-600 pb-2">
                    <h3 className="text-md font-bold mb-2 text-teal-400">Courier Partners</h3>
                    <div className="flex ">
                        <Image
                            height={500}
                            width={500}
                            src="/images/courier-services.png"
                            alt="Courier Partners"
                            className="w-full max-w-xs object-contain"
                        />
                    </div>
                </div>

                {/* Payment Partners */}
                <div>
                    <h3 className="text-md font-bold mb-2 text-teal-400">Payment Partners</h3>
                    <div className="flex ">
                        <Image
                            height={100}
                            width={500}
                            src="/images/payment-methods.png"
                            alt="Payment Partners"
                            className="w-full max-w-xs object-contain"
                        />
                    </div>
                </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-gray-800 py-2">
                <h3 className="text-md font-bold text-center mb-2 text-teal-400">Connect with Us</h3>
                <div className="flex justify-center space-x-4">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                        <Facebook className="h-6 w-6" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                        <Instagram className="h-6 w-6" />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                        <Twitter className="h-6 w-6" />
                    </a>
                </div>
            </div>

            <div className="bg-gray-800 py-2">
                <p className="text-center text-xs text-gray-400">
                    &copy; 2024 FakeStoreNameA, Inc. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
