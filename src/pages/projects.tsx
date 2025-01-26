import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Card,
  CardBody,
  InputGroup,
  InputLeftAddon,
  HStack,
  Divider,
  Grid,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { useAccount, useContractWrite, useContractRead, useWaitForTransaction, useContractReads } from 'wagmi';
import Layout from '@/components/Layout';
import { RESEARCH_PROJECT_ADDRESS, RESEARCH_PROJECT_ABI, NBL_TOKEN_ADDRESS, NBL_TOKEN_ABI } from '@/config/contracts';
import { parseEther, formatEther } from 'viem';
import dynamic from 'next/dynamic';

interface Project {
  id: number;
  researcher: string;
  title: string;
  description: string;
  documentation: string;
  externalUrl: string;
  minDonation: bigint;
  maxDonation: bigint;
  totalDonations: bigint;
}

const ProjectsPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [docsUrl, setDocsUrl] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [minDonation, setMinDonation] = useState('0');
  const [maxDonation, setMaxDonation] = useState('0');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [donationAmount, setDonationAmount] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address } = useAccount();
  const toast = useToast();

  // Create Project
  const { write: createProject, data: createData } = useContractWrite({
    address: RESEARCH_PROJECT_ADDRESS,
    abi: RESEARCH_PROJECT_ABI,
    functionName: 'createProject',
  });

  const { isLoading: isCreating } = useWaitForTransaction({
    hash: createData?.hash,
    onSuccess: () => {
      toast({
        title: 'Project Created',
        description: 'Your research project has been created successfully!',
        status: 'success',
        duration: 5000,
      });
      // Reset form
      setTitle('');
      setDescription('');
      setDocsUrl('');
      setExternalUrl('');
      setMinDonation('0');
      setMaxDonation('0');
      // Refresh projects
      fetchProjects();
    },
  });

  // Approve NBL Token
  const { write: approveToken, data: approveData } = useContractWrite({
    address: NBL_TOKEN_ADDRESS,
    abi: NBL_TOKEN_ABI,
    functionName: 'approve',
  });

  const { isLoading: isApproving } = useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess: async () => {
      toast({
        title: 'Token Approved',
        description: 'NBL token approved for donation',
        status: 'success',
        duration: 3000,
      });
      
      // Proceed with donation after approval
      if (selectedProject && donationAmount) {
        const amount = parseEther(donationAmount);
        await donate({
          args: [BigInt(selectedProject.id), amount],
        });
      }
    },
  });

  // Donate to Project
  const { write: donate, data: donateData } = useContractWrite({
    address: RESEARCH_PROJECT_ADDRESS,
    abi: RESEARCH_PROJECT_ABI,
    functionName: 'donate',
  });

  const { isLoading: isDonating } = useWaitForTransaction({
    hash: donateData?.hash,
    onSuccess: () => {
      toast({
        title: 'Donation Successful',
        description: 'Thank you for supporting this research project!',
        status: 'success',
        duration: 5000,
      });
      onClose();
      setDonationAmount('');
      // Refresh projects
      fetchProjects();
    },
  });

  // Get total number of projects
  const { data: projectCount } = useContractRead({
    address: RESEARCH_PROJECT_ADDRESS,
    abi: RESEARCH_PROJECT_ABI,
    functionName: 'getProjectCount',
  });

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      if (!projectCount) return;
      
      const count = Number(projectCount);
      const projectIds = Array.from({ length: count }, (_, i) => i);
      
      const projectDetails = await Promise.all(
        projectIds.map(async (id) => {
          try {
            const details = await fetch(`/api/projects/${id}`);
            if (!details.ok) {
              throw new Error(`Failed to fetch project ${id}`);
            }
            const project = await details.json();
            return { ...project, id };
          } catch (error) {
            console.error(`Error fetching project ${id}:`, error);
            return null;
          }
        })
      );
      
      setProjects(projectDetails.filter((p): p is Project => p !== null));
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch projects. Please try again.',
        status: 'error',
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [projectCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to create a project',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    // Validate inputs
    if (!title || !description || !minDonation || !maxDonation) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    // Validate donation amounts
    const minAmount = parseFloat(minDonation);
    const maxAmount = parseFloat(maxDonation);
    if (minAmount >= maxAmount) {
      toast({
        title: 'Invalid Donation Range',
        description: 'Maximum donation must be greater than minimum donation',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    try {
      const config = {
        args: [
          title,
          description,
          docsUrl || '',
          externalUrl || '',
          parseEther(minDonation),
          parseEther(maxDonation),
        ],
      };

      console.log('Creating project with config:', config);
      await createProject(config);
    } catch (error: any) {
      console.error('Project creation error:', error);
      toast({
        title: 'Error',
        description: error?.message || 'Failed to create project. Please try again.',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleDonateClick = (project: Project) => {
    setSelectedProject(project);
    onOpen();
  };

  const handleDonate = async () => {
    if (!selectedProject || !donationAmount) return;

    try {
      const amount = parseEther(donationAmount);

      // Check if we already have approval
      const allowance = await fetch(`/api/token/allowance?owner=${address}&spender=${RESEARCH_PROJECT_ADDRESS}`);
      const { allowance: currentAllowance } = await allowance.json();

      if (BigInt(currentAllowance) < amount) {
        // First approve the token transfer
        await approveToken({
          args: [RESEARCH_PROJECT_ADDRESS, amount],
        });
        // The actual donation will be executed in the onSuccess callback of approval
      } else {
        // If we already have approval, proceed with donation
        await donate({
          args: [BigInt(selectedProject.id), amount],
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process donation. Please try again.',
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Layout>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={12} align="stretch">
          <Box textAlign="center">
            <Heading size="2xl" mb={2} bgGradient="linear(to-r, purple.400, blue.500)" bgClip="text">
              Research Projects
            </Heading>
            <Text color="gray.400">Create and manage research projects</Text>
          </Box>

          {/* Create Project Form */}
          <Card bg="navy.800" borderColor="whiteAlpha.200" borderWidth={1}>
            <CardBody>
              <VStack as="form" onSubmit={handleSubmit} spacing={6}>
                <FormControl isRequired>
                  <FormLabel>Project Title</FormLabel>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter project title"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your research project"
                    rows={4}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Documentation URL</FormLabel>
                  <Input
                    value={docsUrl}
                    onChange={(e) => setDocsUrl(e.target.value)}
                    placeholder="Link to project documentation"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>External URL</FormLabel>
                  <Input
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="Link to external resources"
                  />
                </FormControl>

                <HStack width="100%" spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Minimum Donation (NBL)</FormLabel>
                    <InputGroup>
                      <Input
                        type="number"
                        value={minDonation}
                        onChange={(e) => setMinDonation(e.target.value)}
                        min="0"
                        step="0.1"
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Maximum Donation (NBL)</FormLabel>
                    <InputGroup>
                      <Input
                        type="number"
                        value={maxDonation}
                        onChange={(e) => setMaxDonation(e.target.value)}
                        min="0"
                        step="0.1"
                      />
                    </InputGroup>
                  </FormControl>
                </HStack>

                <Button
                  type="submit"
                  colorScheme="purple"
                  size="lg"
                  width="100%"
                  isLoading={isCreating}
                  loadingText="Creating..."
                >
                  Create Project
                </Button>
              </VStack>
            </CardBody>
          </Card>

          {/* Projects Grid */}
          <VStack spacing={4} align="stretch">
            <Heading size="xl" color="white">Active Projects</Heading>
            <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
              {projects.map((project) => (
                <Card
                  key={project.id}
                  bg="navy.800"
                  borderColor="whiteAlpha.200"
                  borderWidth={1}
                  _hover={{ borderColor: 'purple.500', transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                >
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      <Heading size="md" color="white">{project.title}</Heading>
                      <Text color="gray.400" noOfLines={3}>{project.description}</Text>
                      <HStack>
                        <Badge colorScheme="purple">
                          Min: {formatEther(project.minDonation)} NBL
                        </Badge>
                        <Badge colorScheme="blue">
                          Max: {formatEther(project.maxDonation)} NBL
                        </Badge>
                      </HStack>
                      <Button
                        colorScheme="purple"
                        variant="outline"
                        onClick={() => handleDonateClick(project)}
                      >
                        Donate
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </Grid>
          </VStack>
        </VStack>

        {/* Donation Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent bg="navy.800">
            <ModalHeader color="white">Donate to Project</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <Text color="gray.400">
                  Project: {selectedProject?.title}
                </Text>
                <FormControl>
                  <FormLabel>Amount (NBL)</FormLabel>
                  <NumberInput
                    value={donationAmount}
                    onChange={(value) => setDonationAmount(value)}
                    min={selectedProject ? Number(formatEther(selectedProject.minDonation)) : 0}
                    max={selectedProject ? Number(formatEther(selectedProject.maxDonation)) : 0}
                    precision={6}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <Button
                  colorScheme="purple"
                  width="100%"
                  onClick={handleDonate}
                  isLoading={isApproving || isDonating}
                  loadingText={isApproving ? "Approving..." : "Donating..."}
                >
                  Donate
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(ProjectsPage), {
  ssr: false,
});
