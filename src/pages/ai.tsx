import Layout from '@/components/Layout';
import { AI_MODEL_REGISTRY_ADDRESS, AI_MODEL_REGISTRY_ABI, DSCI_TOKEN_ADDRESS } from '@/config/contracts';
import { useState, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite, useContractReads, useWaitForTransaction } from 'wagmi';
import { ethers } from 'ethers';

interface Model {
  id: number;
  owner: string;
  name: string;
  description: string;
  pricePerQuery: bigint;
  active: boolean;
  totalQueries: number;
  reputation: number;
}

export default function AI() {
  const { address, isConnected } = useAccount();
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states for registering new model
  const [newModelName, setNewModelName] = useState('');
  const [newModelDescription, setNewModelDescription] = useState('');
  const [newModelPrice, setNewModelPrice] = useState('');

  // Contract interactions
  const { data: userModels } = useContractRead({
    address: AI_MODEL_REGISTRY_ADDRESS,
    abi: AI_MODEL_REGISTRY_ABI,
    functionName: 'getUserModels',
    args: [address],
    enabled: !!address,
  });

  // Approve DSCI tokens
  const { write: approveTokens } = useContractWrite({
    address: DSCI_TOKEN_ADDRESS,
    abi: [
      "function approve(address spender, uint256 amount) returns (bool)"
    ],
    functionName: 'approve',
  });

  // Register new model
  const { write: registerModel, data: registerData } = useContractWrite({
    address: AI_MODEL_REGISTRY_ADDRESS,
    abi: AI_MODEL_REGISTRY_ABI,
    functionName: 'registerModel',
  });

  // Create compute request
  const { write: createRequest, data: requestData } = useContractWrite({
    address: AI_MODEL_REGISTRY_ADDRESS,
    abi: AI_MODEL_REGISTRY_ABI,
    functionName: 'createComputeRequest',
  });

  // Wait for transactions
  const { isLoading: isRegisterLoading } = useWaitForTransaction({
    hash: registerData?.hash,
  });

  const { isLoading: isRequestLoading } = useWaitForTransaction({
    hash: requestData?.hash,
  });

  // Load models data
  useEffect(() => {
    if (userModels) {
      const loadModels = async () => {
        const modelPromises = (userModels as number[]).map(async (id) => {
          const model = await fetchModelDetails(id);
          return { ...model, id };
        });
        const loadedModels = await Promise.all(modelPromises);
        setModels(loadedModels);
      };
      loadModels();
    }
  }, [userModels]);

  const fetchModelDetails = async (id: number) => {
    // Implementation would depend on your contract structure
    // This is a placeholder
    return {
      id,
      owner: '0x...',
      name: 'Model ' + id,
      description: 'Description',
      pricePerQuery: BigInt(1),
      active: true,
      totalQueries: 0,
      reputation: 100,
    };
  };

  const handleRegisterModel = async () => {
    if (!newModelName || !newModelDescription || !newModelPrice) return;

    const priceInWei = ethers.utils.parseEther(newModelPrice);
    registerModel({
      args: [newModelName, newModelDescription, priceInWei],
    });
  };

  const handleCreateRequest = async () => {
    if (!selectedModel || !prompt) return;
    setLoading(true);

    try {
      // First approve tokens
      const model = models.find(m => m.id === selectedModel);
      if (!model) return;

      approveTokens({
        args: [AI_MODEL_REGISTRY_ADDRESS, model.pricePerQuery],
      });

      // Create request
      createRequest({
        args: [selectedModel, prompt],
      });

      // Call Gemini AI
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">AI Models Platform</h1>

        {/* Register New Model Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Register New AI Model</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Model Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={newModelName}
                onChange={(e) => setNewModelName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={newModelDescription}
                onChange={(e) => setNewModelDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price per Query (DSCI)</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={newModelPrice}
                onChange={(e) => setNewModelPrice(e.target.value)}
              />
            </div>
            <button
              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              onClick={handleRegisterModel}
              disabled={isRegisterLoading}
            >
              {isRegisterLoading ? 'Registering...' : 'Register Model'}
            </button>
          </div>
        </div>

        {/* Use AI Model Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Use AI Model</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Model</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={selectedModel || ''}
                onChange={(e) => setSelectedModel(Number(e.target.value))}
              >
                <option value="">Select a model</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} - {ethers.utils.formatEther(model.pricePerQuery)} DSCI per query
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prompt</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
              />
            </div>
            <button
              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              onClick={handleCreateRequest}
              disabled={!selectedModel || !prompt || loading || isRequestLoading}
            >
              {loading || isRequestLoading ? 'Processing...' : 'Send Request'}
            </button>
          </div>

          {/* Result Section */}
          {result && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Result</h3>
              <div className="mt-2 p-4 bg-gray-50 rounded-md">
                <pre className="whitespace-pre-wrap">{result}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
