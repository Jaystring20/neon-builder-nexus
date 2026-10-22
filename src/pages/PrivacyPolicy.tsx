import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PRIVACY_EMAIL = "hello@digitalcreativeshubltd.com";
const DPO_EMAIL = "jerry@digitalcreativeshubltd.com";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title="Privacy Policy"
      description="How Digital Creatives Hub collects, uses, shares and protects personal data, and how to use your rights."
      path="/privacy-policy"
    />
    <Navbar />
    <main className="pt-28">
      <article className="container-narrow pb-24 md:pb-32 max-w-3xl">
        <h1 className="font-display-refined text-4xl sm:text-5xl text-foreground mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-12">Last updated: 22 October 2026</p>

        <div className="space-y-10 text-base leading-relaxed text-foreground/90">
          <section className="space-y-4">
            <p>
              Digital Creatives Hub Ltd ("DCH", "we", "us") runs this website and the Growth Diagnostic. This policy
              explains what personal data we collect, why, who we share it with, how long we keep it, and your rights.
            </p>
            <p>
              <span className="font-semibold text-foreground">Registered office:</span> 21, Osunyemi Close, Ladipo,
              Oshodi, Lagos, Nigeria.
              <br />
              <span className="font-semibold text-foreground">Privacy requests:</span>{" "}
              <a href={`mailto:${PRIVACY_EMAIL}`} className="text-primary hover:underline">
                {PRIVACY_EMAIL}
              </a>
              <br />
              <span className="font-semibold text-foreground">Data Protection Officer:</span> Jerry,{" "}
              <a href={`mailto:${DPO_EMAIL}`} className="text-primary hover:underline">
                {DPO_EMAIL}
              </a>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display-refined text-2xl text-foreground">1. What we collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-semibold text-foreground">Diagnostic details:</span> the answers you give in the
                Growth Diagnostic, and your first name if you enter it.
              </li>
              <li>
                <span className="font-semibold text-foreground">Contact details:</span> your email address, so we can
                send your result and follow-up emails.
              </li>
              <li>
                <span className="font-semibold text-foreground">Newsletter consent:</span> whether you ticked the
                BuildWithJA Insights box, and the date and time you did.
              </li>
              <li>
                <span className="font-semibold text-foreground">Visit information:</span> a random session identifier
                stored in your browser, and where you came from (for example a link you clicked), so we can understand
                how the diagnostic is used. It doesn't identify you by name.
              </li>
              <li>
                <span className="font-semibold text-foreground">Bookings:</span> if you book a call through our
                calendar, the booking provider handles the details you enter.
              </li>
            </ul>
            <p>
              We don't ask for sensitive personal data, such as health or religious information. Please don't include it
              in your answers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display-refined text-2xl text-foreground">2. Why we use it and our legal basis</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-semibold text-foreground">Your result and follow-up emails:</span> your answers,
                email and first name, because you asked for the diagnostic.
              </li>
              <li>
                <span className="font-semibold text-foreground">The BuildWithJA Insights newsletter:</span> your email,
                first name and consent record, because you agreed to receive it.
              </li>
              <li>
                <span className="font-semibold text-foreground">Understanding how the diagnostic is used:</span> the
                session identifier and source, because we have a legitimate interest in improving the service.
              </li>
              <li>
                <span className="font-semibold text-foreground">Keeping consent records:</span> the consent tick and its
                time, to meet our legal obligations and to show that you agreed.
              </li>
            </ul>
            <p>
              You can withdraw newsletter consent at any time. Withdrawing doesn't affect the diagnostic emails about
              your result.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display-refined text-2xl text-foreground">3. Who we share it with</h2>
            <p>We use these providers to run the site and send messages. Each receives only what it needs:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-semibold text-foreground">Supabase</span> stores the diagnostic answers and
                consent records.
              </li>
              <li>
                <span className="font-semibold text-foreground">Resend</span> sends our emails and keeps the newsletter
                list.
              </li>
              <li>
                <span className="font-semibold text-foreground">Make.com</span> passes newsletter sign-ups from our
                website to Resend.
              </li>
              <li>
                <span className="font-semibold text-foreground">Vercel</span> hosts the website and runs its server
                functions.
              </li>
              <li>
                <span className="font-semibold text-foreground">Calendly</span> handles bookings, if you choose to book
                a call.
              </li>
            </ul>
            <p>We don't sell your personal data. We share it only with these providers, or where the law requires it.</p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display-refined text-2xl text-foreground">4. Where your data is processed</h2>
            <p>
              These providers operate in other countries, so your data may be transferred and stored outside Nigeria.
              Where we do this, we use providers that have appropriate safeguards in place, and we only transfer the
              data needed for the purposes described above.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display-refined text-2xl text-foreground">5. How long we keep it</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-semibold text-foreground">Newsletter contacts</span> stay on the list until they
                unsubscribe.
              </li>
              <li>
                <span className="font-semibold text-foreground">Diagnostic answers and consent records</span> are
                deleted or anonymised two years after your last activity with us. You can ask us to delete them sooner.
                We keep a record only where the law requires it.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display-refined text-2xl text-foreground">6. Your rights</h2>
            <p>Depending on where you live, you can:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>ask for a copy of the personal data we hold about you;</li>
              <li>ask us to correct data that is wrong;</li>
              <li>ask us to delete your data;</li>
              <li>object to, or ask us to restrict, how we use it;</li>
              <li>withdraw consent at any time;</li>
              <li>ask for your data in a format you can take to another provider.</li>
            </ul>
            <p>
              To use any of these rights, email{" "}
              <a href={`mailto:${PRIVACY_EMAIL}`} className="text-primary hover:underline">
                {PRIVACY_EMAIL}
              </a>
              . We'll respond within 48 hours. We may ask you to confirm who you are before we act.
            </p>
            <p>
              Newsletter emails always include an unsubscribe link. Clicking it stops newsletter emails straight away.
            </p>
            <p>
              <span className="font-semibold text-foreground">Complaints.</span> If you're not satisfied with how we
              handle your data, you can complain to the Nigeria Data Protection Commission, or to the data protection
              authority in your country.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display-refined text-2xl text-foreground">7. Cookies and browser storage</h2>
            <p>
              The Growth Diagnostic stores a session identifier and a source note in your browser, so the diagnostic can
              be followed through its steps. These are used only for the diagnostic. We don't use analytics or
              advertising cookies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display-refined text-2xl text-foreground">8. Children</h2>
            <p>
              Our services are for adults. We don't knowingly collect personal data from anyone under 18. If you believe a
              child has given us their data, email us and we'll delete it.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display-refined text-2xl text-foreground">9. Changes to this policy</h2>
            <p>
              We update this policy when our services or how we use data change. The date at the top shows when it was
              last updated. For major changes, we'll tell people on our newsletter list.
            </p>
          </section>
        </div>
      </article>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicy;
