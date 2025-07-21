import { Card } from 'antd';
import { useTheme } from '../../context/ThemeContext';

interface JsonPreviewProps {
  schema: Record<string, any>;
}

// Custom JSON formatter with colored brackets
const ColoredJsonFormatter = ({ json }: { json: string }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Track bracket depth for different colors
  let curlyBracketDepth = 0;
  let squareBracketDepth = 0;
  
  // Process the JSON string character by character for proper bracket coloring
  let formattedJson = '';
  let inString = false;
  let escaped = false;
  
  for (let i = 0; i < json.length; i++) {
    const char = json[i];
    
    // Handle string content
    if (char === '"' && !escaped) {
      inString = !inString;
      formattedJson += inString ? 
        '<span class="json-string">"' : 
        '"</span>';
      continue;
    }
    
    // Handle escape character
    if (char === '\\' && inString) {
      escaped = !escaped;
      formattedJson += char;
      continue;
    } else {
      escaped = false;
    }
    
    // If in string, just add the character
    if (inString) {
      formattedJson += char;
      continue;
    }
    
    // Handle brackets with depth-based coloring
    if (char === '{') {
      curlyBracketDepth++;
      formattedJson += `<span class="json-bracket json-curly-${curlyBracketDepth % 3}">{</span>`;
    } else if (char === '}') {
      formattedJson += `<span class="json-bracket json-curly-${curlyBracketDepth % 3}">}</span>`;
      curlyBracketDepth--;
    } else if (char === '[') {
      squareBracketDepth++;
      formattedJson += `<span class="json-bracket json-square-${squareBracketDepth % 3}">[</span>`;
    } else if (char === ']') {
      formattedJson += `<span class="json-bracket json-square-${squareBracketDepth % 3}">]</span>`;
      squareBracketDepth--;
    } else if (char === ':') {
      // Look behind for key
      const keyMatch = formattedJson.match(/"([^"]*)"\<\/span>$/); 
      if (keyMatch) {
        // Replace the last closing span with a key-specific span
        formattedJson = formattedJson.replace(/"([^"]*)"\<\/span>$/, 
          `"$1"</span><span class="json-colon">:</span>`);
      } else {
        formattedJson += char;
      }
    } else if (char === 't' && json.substring(i, i + 4) === 'true') {
      formattedJson += '<span class="json-boolean">true</span>';
      i += 3; // Skip the rest of 'true'
    } else if (char === 'f' && json.substring(i, i + 5) === 'false') {
      formattedJson += '<span class="json-boolean">false</span>';
      i += 4; // Skip the rest of 'false'
    } else if (char === 'n' && json.substring(i, i + 4) === 'null') {
      formattedJson += '<span class="json-null">null</span>';
      i += 3; // Skip the rest of 'null'
    } else if (char.match(/[0-9]/)) {
      // Capture the entire number
      let number = '';
      while (i < json.length && (json[i].match(/[0-9.]/) || json[i] === '-')) {
        number += json[i];
        i++;
      }
      i--; // Adjust for the loop increment
      formattedJson += `<span class="json-number">${number}</span>`;
    } else {
      formattedJson += char;
    }
  }

  return (
    <pre 
      className={`json-preview ${isDark ? 'dark' : 'light'}`}
      dangerouslySetInnerHTML={{ __html: formattedJson }}
    />
  );
};

const JsonPreview = ({ schema }: JsonPreviewProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Format the JSON with proper indentation
  const formattedJson = JSON.stringify(schema, null, 2);
  
  return (
    <Card 
      title="JSON Preview" 
      className="json-preview-card"
      bordered={false}
      extra={<span className="json-preview-label">Schema Output</span>}
    >
      <div 
        className="json-preview-container"
        style={{
          borderRadius: '8px',
          padding: '16px',
          maxHeight: '600px',
          overflow: 'auto',
          backgroundColor: isDark ? '#1a1a2e' : '#f8fafc',
          boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <ColoredJsonFormatter json={formattedJson} />
      </div>
    </Card>
  );
};

export default JsonPreview;