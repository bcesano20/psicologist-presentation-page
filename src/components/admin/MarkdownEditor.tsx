import { useState } from 'react';
import { marked } from 'marked';

interface MarkdownEditorProps {
  name?: string;
  initialValue?: string;
}

const MarkdownEditor = ({ name = 'content', initialValue = '' }: MarkdownEditorProps) => {
  const [content, setContent] = useState<string>(initialValue);

  const previewHtml = marked.parse(content || '_Nada para mostrar todavía..._', {
    async: false,
  }) as string;

  return (
    <div className="nav:grid-cols-2 grid grid-cols-1 gap-4">
      <div>
        <label
          htmlFor="markdown-editor"
          className="text-primary-700 mb-1 block text-sm font-medium"
        >
          Contenido
        </label>
        <textarea
          id="markdown-editor"
          name={name}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={16}
          placeholder="Escribi el contenido del post ..."
          className="border-primary-200 text-primary-900 focus:border-primary-400 focus:ring-primary-400 w-full rounded-xl border bg-white px-4 py-3 font-mono text-sm focus:ring-2 focus:outline-none"
        />
      </div>

      <div>
        <span className="text-primary-700 mb-1 block text-sm font-medium">Vista previa</span>
        <div
          className="prose prose-sm border-primary-100 bg-secondary-50 min-h-104 max-w-none overflow-y-auto rounded-xl border px-4 py-3"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      </div>
    </div>
  );
};

export default MarkdownEditor;
