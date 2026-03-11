import "./globals.css";

export const metadata = {
  title: "BRUTAL TOOLS v.3.0",
  description: "Bento Image & PDF Processing Suite",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
