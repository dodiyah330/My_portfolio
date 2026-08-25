import React from "react";

const flushList = (items, listType, keyBase, nodes) => {
  if (!items.length) return;
  const ListTag = listType === "ol" ? "ol" : "ul";
  nodes.push(
    <ListTag className="notion-body__list" key={`${keyBase}-${listType}-${nodes.length}`}>
      {items.map((item, index) => (
        <li key={`${keyBase}-item-${index}`}>{item}</li>
      ))}
    </ListTag>
  );
  items.length = 0;
};

export const NotionBody = ({ blocks }) => {
  if (!blocks?.length) {
    return (
      <div className="notion-body notion-body--empty">
        <p>This article content could not be loaded yet. Open it in Notion to read the full post.</p>
      </div>
    );
  }

  const nodes = [];
  let bulletBuffer = [];
  let numberBuffer = [];

  blocks.forEach((block, index) => {
    const key = `block-${index}`;

    if (block.type === "li") {
      flushList(numberBuffer, "ol", key, nodes);
      bulletBuffer.push(block.text);
      return;
    }

    if (block.type === "oli") {
      flushList(bulletBuffer, "ul", key, nodes);
      numberBuffer.push(block.text);
      return;
    }

    flushList(bulletBuffer, "ul", key, nodes);
    flushList(numberBuffer, "ol", key, nodes);

    switch (block.type) {
      case "h2":
        nodes.push(<h2 key={key}>{block.text}</h2>);
        break;
      case "h3":
        nodes.push(<h3 key={key}>{block.text}</h3>);
        break;
      case "h4":
        nodes.push(<h4 key={key}>{block.text}</h4>);
        break;
      case "quote":
        nodes.push(<blockquote key={key}>{block.text}</blockquote>);
        break;
      case "code":
        nodes.push(
          <pre key={key} className="notion-body__code">
            <code>{block.text}</code>
          </pre>
        );
        break;
      case "callout":
        nodes.push(
          <aside key={key} className="notion-body__callout">
            {block.text}
          </aside>
        );
        break;
      case "todo":
        nodes.push(
          <label key={key} className="notion-body__todo">
            <input type="checkbox" checked={Boolean(block.checked)} readOnly />
            <span>{block.text}</span>
          </label>
        );
        break;
      case "hr":
        nodes.push(<hr key={key} />);
        break;
      case "img":
        nodes.push(
          <figure key={key} className="notion-body__figure">
            <img src={block.src} alt={block.alt || "Article image"} loading="lazy" />
          </figure>
        );
        break;
      default:
        nodes.push(<p key={key}>{block.text}</p>);
    }
  });

  flushList(bulletBuffer, "ul", "end", nodes);
  flushList(numberBuffer, "ol", "end", nodes);

  return <div className="notion-body">{nodes}</div>;
};
