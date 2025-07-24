
import './App.css';
import { useState } from 'react';




function App() {
  
  const [key, setKey] = useState('');
  const [query, setQuery] = useState('');
  const [botRes, setBotres] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAns = async () => {
    setLoading(true);
    setError('');
    setBotres('');


    const api_url = "https://promptflowdev.dealogic.com/api/v1/endpoint/support-chatbot-dev/score";
    const api_key = process.env.REACT_APP_SUPPORT_CHATBOT;

      
      
    if (!api_key) {
      setError('API key is missing.');
      setLoading(false);
      return;
    }

    const requestBody = JSON.stringify({
      Key: key,
      Query: query,
    });

    const requestHeaders = new Headers({'Content-Type': 'application/json'});

    requestHeaders.append("Authorization", "Bearer " + api_key);
    requestHeaders.append("azureml-model-deployment", "green");



    try {
      const response = await fetch(api_url, {
        method: 'POST',
        body: requestBody,
        headers: requestHeaders,
      });

      if (!response.ok) {
        throw new Error(`Request failed with status code ${response.status}`);
      }

      const json = await response.json();
      const extraction = JSON.parse(json.Extraction);
      setBotres(extraction.Response);
    } catch (err) {
      console.log("Here -> ")
      setError(err.message);
    } finally {
      setLoading(false);
    }

  }


  

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#091422' }}>
      <div className="w-full max-w-md bg-[#0f1a2e] text-white p-6 rounded-lg shadow-lg space-y-6">
        <h1 className="text-3xl font-bold text-center">Support Companion</h1>

        <div>
          <label className="block text-sm font-medium mb-2">Key:</label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter Key"
            className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Query:</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Query"
            className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          onClick={fetchAns}
          disabled={loading || !key || !query}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Generate Response'}
        </button>

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

        {botRes && (
          <div className="mt-4 p-4 bg-[#13233b] rounded">
            <h3 className="font-semibold mb-2">Response:</h3>
            
            <div className="space-y-2">
              {botRes.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );


}

export default App;
