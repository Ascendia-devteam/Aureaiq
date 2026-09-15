import { useRef, useState, type FormEvent } from 'react';
import { contact, enquiryTopics, reachGroups } from '@/content/contact';
import { staggerItem, useStaggerReveal } from '@/hooks/animations';
import { usePreloader } from '@/hooks/usePreloader';
import { CtaButton } from '@/components/ui/Cta';
import { EmphasisedText } from '@/components/ui/EmphasisedText';
import { Icon } from '@/components/ui/Icon';
import { SectionHead } from '@/components/ui/SectionHead';
import { Shell } from '@/components/layout/Shell';

/** The contact channels, as a list of labelled values. */
function Reach() {
  const ref = useRef<HTMLDivElement>(null);
  const { isReady } = usePreloader();
  useStaggerReveal(ref, isReady);

  return (
    <div className="reach" ref={ref}>
      {reachGroups.map((group) => (
        <div className="reach__group" key={group.id} {...staggerItem}>
          <p className="reach__label">
            {group.icon && <Icon name={group.icon} />}
            {group.label}
          </p>

          {group.links ? (
            <p className="reach__social">
              {group.links.map((link) => (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </p>
          ) : (
            <p className="reach__value">
              {group.href ? <a href={group.href}>{group.value}</a> : group.value}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

const EMPTY_ENQUIRY = {
  name: '',
  org: '',
  contact: '',
  topic: enquiryTopics[0].value,
  detail: '',
};

/**
 * The enquiry form.
 *
 * There is no backend yet: submitting acknowledges the visitor and
 * stops. Wire `sendEnquiry` to the real endpoint and the rest of the
 * component — including the disabled state — already behaves.
 */
function EnquiryForm() {
  const [values, setValues] = useState(EMPTY_ENQUIRY);
  const [isSent, setIsSent] = useState(false);

  const update = (field: keyof typeof EMPTY_ENQUIRY) => (
    event: { target: { value: string } },
  ) => setValues((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: POST `values` to the enquiry endpoint once it exists.
    setIsSent(true);
  };

  return (
    <form className="enquiry" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="f-name">Name</label>
        <input
          id="f-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={values.name}
          onChange={update('name')}
        />
      </div>

      <div className="field">
        <label htmlFor="f-org">Company or organisation</label>
        <input
          id="f-org"
          name="org"
          type="text"
          autoComplete="organization"
          value={values.org}
          onChange={update('org')}
        />
      </div>

      <div className="field">
        <label htmlFor="f-contact">Email or phone</label>
        <input
          id="f-contact"
          name="contact"
          type="text"
          autoComplete="email"
          required
          value={values.contact}
          onChange={update('contact')}
        />
      </div>

      <div className="field">
        <label htmlFor="f-need">What do you need help with?</label>
        <select id="f-need" name="need" value={values.topic} onChange={update('topic')}>
          {enquiryTopics.map((topic) => (
            <option key={topic.value} value={topic.value}>
              {topic.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="f-detail">Anything we should read first</label>
        <textarea
          id="f-detail"
          name="detail"
          rows={3}
          value={values.detail}
          onChange={update('detail')}
        />
      </div>

      <p className="enquiry__note">{contact.formNote}</p>

      <CtaButton type="submit" disabled={isSent}>
        {isSent ? contact.submittedLabel : contact.submitLabel}
      </CtaButton>
    </form>
  );
}

export function Contact() {
  return (
    <section className="band" id="contact">
      <Shell>
        <SectionHead heading={<EmphasisedText {...contact.heading} />} lede={contact.lede} />
        <div className="contact">
          <Reach />
          <EnquiryForm />
        </div>
      </Shell>
    </section>
  );
}
