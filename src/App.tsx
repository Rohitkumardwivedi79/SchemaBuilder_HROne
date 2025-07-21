import { SchemaBuilder } from './components/SchemaBuilder'
import ThemeToggle from './components/ThemeToggle'
import { Layout, Typography, Badge, Tooltip } from 'antd'
import { useTheme } from './context/ThemeContext'
import { CodeOutlined, DatabaseOutlined, BulbOutlined } from '@ant-design/icons'

const { Header, Content, Footer } = Layout
const { Title, Text } = Typography

function App() {
  const { theme } = useTheme();

  const handleSchemaChange = (newSchema: Record<string, any>) => {
    console.log('Schema updated:', newSchema);
  };

  // Example initial schema
  const initialSchema = {};

  return (
    <Layout className={`app-layout ${theme}-theme`}>
      <Header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <DatabaseOutlined className="header-icon" />
            <Title level={3} className="app-title">Schema Builder</Title>
            <Badge count="Pro" className="pro-badge" />
          </div>
          <div className="header-right">
            <Tooltip title="Toggle Theme">
              <ThemeToggle />
            </Tooltip>
          </div>
        </div>
      </Header>
      <Content className="app-content">
        <div className="app-intro">
          <Text className="app-description">
            <BulbOutlined /> Build and visualize your JSON schema with our interactive builder
          </Text>
        </div>
        <SchemaBuilder 
          initialSchema={initialSchema} 
          onChange={handleSchemaChange} 
        />
      </Content>
      <Footer className="app-footer">
        <Text className="footer-text">
          <CodeOutlined /> Schema Builder - Dynamic JSON Schema Generator
        </Text>
      </Footer>
    </Layout>
  )
}

export default App