import { faqData } from '@/constants/LandingPage';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

const Faq = () => {
  return (
    <section className="mx-auto max-w-[400px] md:max-w-[900px]">
      <h2 className="mb-12 text-center text-4xl font-bold sm:text-5xl">
        Frequently Asked Questions
      </h2>
      <Accordion type="multiple">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {faqData.map((faq) => (
            <AccordionItem value={faq.question} className={'last:border-b'}>
              <AccordionTrigger className="cursor-pointer text-slate-200 sm:text-xl lg:text-2xl">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-slate-500">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </div>
      </Accordion>
    </section>
  );
};

export default Faq;
