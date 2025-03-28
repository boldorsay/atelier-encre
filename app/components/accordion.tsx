"use client";
import { useState } from "react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { tinaField } from "tinacms/dist/react";
import "./accordion.css";

interface AccordionItemProps {
    title: string;
    content: any;
    isOpen: boolean;
    onClick: () => void;
    itemField: any;
    contentField: any;
}

function AccordionItem({ title, content, isOpen, onClick, itemField, contentField }: AccordionItemProps) {
    return (
        <div className={`accordion-item ${isOpen ? 'active' : ''}`}>
            <div
                className="accordion-header"
                onClick={onClick}
                data-tina-field={itemField}
            >
                <h3>{title}</h3>
                <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
            </div>
            <div
                className={`accordion-content ${isOpen ? 'open' : ''}`}
                data-tina-field={contentField}
            >
                <div className="accordion-content-inner">
                    <TinaMarkdown content={content} />
                </div>
            </div>
        </div>
    );
}

export default function Accordion({ items, tinaData }) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <section className="accordion-section">
            <h2 className="accordion-title">Services</h2>
            <div className="accordion-container">
                {items.map((item, index) => (
                    <AccordionItem
                        key={index}
                        title={item.title}
                        content={item.content}
                        isOpen={openIndex === index}
                        onClick={() => toggleAccordion(index)}
                        itemField={tinaField(tinaData.page.accordion[index], "title")}
                        contentField={tinaField(tinaData.page.accordion[index], "content")}
                    />
                ))}
            </div>
        </section>
    );
} 