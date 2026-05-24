export const metadata = {
  title: 'Privacy Policy | George Papatheodorou Taxi Transfer & Tours',
  description: 'Privacy Policy and data handling practices for George Athens Taxi transfers and tours.',
};

export default function PrivacyPage() {
  return (
    <div className="page-container" style={{ padding: '4rem 0', minHeight: '80vh', backgroundColor: 'var(--color-bg-light)' }}>
      <div className="container" style={{ maxWidth: '800px', backgroundColor: '#fff', padding: '3rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h1 className="font-serif" style={{ color: 'var(--color-charcoal)', marginBottom: '2rem', textAlign: 'center' }}>Privacy Policy</h1>
        
        <div style={{ lineHeight: '1.8', color: '#4a5568' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            <strong>Effective Date:</strong> May 24, 2026
          </p>

          <p style={{ marginBottom: '2rem' }}>
            At George Papatheodorou Taxi Transfer & Tours, we are committed to protecting your privacy and ensuring your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and protect your data.
          </p>

          <h2 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--color-azure-dark)', marginTop: '2.5rem', marginBottom: '1rem' }}>
            1. Information We Collect
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            When you request a quote, make a booking, or contact us through our website, we may collect the following personal information:
          </p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginBottom: '2rem' }}>
            <li>Full Name</li>
            <li>Email Address</li>
            <li>Mobile Phone Number (e.g., WhatsApp)</li>
            <li>Pickup and Drop-off Locations</li>
            <li>Flight/Port Arrival Details (including Estimated Time of Arrival)</li>
            <li>Any special requests or notes you provide</li>
          </ul>

          <h2 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--color-azure-dark)', marginTop: '2.5rem', marginBottom: '1rem' }}>
            2. How We Use Your Information
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            The information we collect is used exclusively for the following purposes:
          </p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginBottom: '2rem' }}>
            <li>To arrange and execute the transportation or tour services you requested.</li>
            <li>To communicate with you regarding your booking (e.g., sending quotes, confirmations, and pickup instructions).</li>
            <li>To provide customer support and respond to your inquiries.</li>
          </ul>

          <h2 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--color-azure-dark)', marginTop: '2.5rem', marginBottom: '1rem' }}>
            3. Information Sharing and Disclosure
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            <strong>We do not sell, trade, or rent your personal information to third parties.</strong>
          </p>
          <p style={{ marginBottom: '2rem' }}>
            <strong>Customer Contact Information Sharing:</strong> By using our services, customers agree that their mobile phone number and name may be shared with our assigned drivers. This is done <em>solely</em> for the purpose of communication regarding pickup instructions, meeting points, transfer coordination, and other transportation-related updates on the day of service. 
          </p>

          <h2 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--color-azure-dark)', marginTop: '2.5rem', marginBottom: '1rem' }}>
            4. Data Security & Retention
          </h2>
          <p style={{ marginBottom: '2rem' }}>
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, including for the purposes of satisfying any legal, accounting, or reporting requirements.
          </p>

          <h2 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--color-azure-dark)', marginTop: '2.5rem', marginBottom: '1rem' }}>
            5. Your Rights
          </h2>
          <p style={{ marginBottom: '2rem' }}>
            You have the right to request access to the personal information we hold about you, to request corrections to any inaccurate data, and to request the deletion of your personal data when it is no longer necessary for the purposes for which it was collected.
          </p>

          <h2 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--color-azure-dark)', marginTop: '2.5rem', marginBottom: '1rem' }}>
            6. Contact Us
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
          </p>
          <p>
            <strong>George Papatheodorou Taxi Transfer & Tours</strong><br />
            Email: <a href="mailto:gpapathe77@gmail.com" style={{ color: 'var(--color-azure-dark)', textDecoration: 'underline' }}>gpapathe77@gmail.com</a><br />
            Phone/WhatsApp: <a href="https://wa.me/306944466259" style={{ color: 'var(--color-azure-dark)', textDecoration: 'underline' }}>+30 694 446 6259</a>
          </p>
        </div>
      </div>
    </div>
  );
}
