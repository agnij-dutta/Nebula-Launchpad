import { useState, useEffect } from 'react';
import { useContractRead, usePublicClient } from 'wagmi';
import Layout from '@/components/Layout';
import ResearchCard from '@/components/ResearchCard';
import { RESEARCH_PROJECT_ADDRESS, RESEARCH_PROJECT_ABI } from '@/config/contracts';
import { formatEther } from 'viem';

export default function ResearchFeed() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const publicClient = usePublicClient();

  // Get total number of projects
  const { data: projectCount } = useContractRead({
    address: RESEARCH_PROJECT_ADDRESS,
    abi: RESEARCH_PROJECT_ABI,
    functionName: 'getProjectCount',
    watch: true,
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        if (!projectCount) return;

        const count = Number(projectCount);
        const projectPromises = [];

        for (let i = 0; i < count; i++) {
          const projectPromise = publicClient.readContract({
            address: RESEARCH_PROJECT_ADDRESS,
            abi: RESEARCH_PROJECT_ABI,
            functionName: 'getProjectDetails',
            args: [BigInt(i)],
          }).then((projectDetails: any) => ({
            id: i,
            researcher: projectDetails[0],
            title: projectDetails[1],
            description: projectDetails[2],
            documentation: projectDetails[3],
            externalUrl: projectDetails[4],
            minDonation: formatEther(projectDetails[5]),
            maxDonation: formatEther(projectDetails[6]),
            totalFunds: formatEther(projectDetails[7]),
            isActive: projectDetails[8],
          })).catch(error => {
            console.error(`Error fetching project ${i}:`, error);
            return null;
          });

          projectPromises.push(projectPromise);
        }

        const fetchedProjects = (await Promise.all(projectPromises)).filter(Boolean);
        console.log('Fetched projects:', fetchedProjects);
        setProjects(fetchedProjects);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [projectCount, publicClient]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Research Projects</h1>
            <p className="text-text-secondary mt-2">
              Discover and fund groundbreaking research projects
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-purple mx-auto"></div>
              <p className="text-text-secondary mt-4">Loading projects...</p>
            </div>
          ) : projects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <ResearchCard
                  key={index}
                  projectId={project.id}
                  researcher={project.researcher}
                  title={project.title}
                  description={project.description}
                  documentation={project.documentation}
                  externalUrl={project.externalUrl}
                  minDonation={project.minDonation}
                  maxDonation={project.maxDonation}
                  totalFunds={project.totalFunds}
                  isActive={project.isActive}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-text-secondary">No research projects found</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
