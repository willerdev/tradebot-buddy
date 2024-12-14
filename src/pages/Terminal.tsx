import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { WebContainer } from '@webcontainer/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export default function Terminal() {
  const { botId } = useParams();
  const [output, setOutput] = useState<string[]>([]);
  const { toast } = useToast();
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);

  useEffect(() => {
    async function startWebContainer() {
      try {
        // Initialize WebContainer
        const wc = await WebContainer.boot();
        setWebcontainer(wc);

        // Create a simple Node.js script for the bot
        const files = {
          'index.js': {
            file: {
              contents: `
                console.log('Bot ${botId} starting...');
                
                // Simulate bot running
                setInterval(() => {
                  console.log('Checking prices...');
                  // Add your bot logic here
                }, 5000);
              `,
            },
          },
          'package.json': {
            file: {
              contents: `
                {
                  "name": "bot-runner",
                  "type": "module",
                  "dependencies": {}
                }
              `,
            },
          },
        };

        // Write files to the container
        await wc.mount(files);

        // Start the process
        const process = await wc.spawn('node', ['index.js']);

        // Handle process output
        process.output.pipeTo(
          new WritableStream({
            write(data) {
              setOutput((prev) => [...prev, data]);
            },
          })
        );

        toast({
          title: "Terminal Started",
          description: "Bot terminal is now running",
        });

      } catch (error) {
        console.error('Failed to start WebContainer:', error);
        toast({
          title: "Error",
          description: "Failed to start terminal",
          variant: "destructive",
        });
      }
    }

    startWebContainer();

    return () => {
      // Cleanup WebContainer when component unmounts
      if (webcontainer) {
        webcontainer.teardown();
      }
    };
  }, [botId]);

  return (
    <div className="container mx-auto py-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Bot Terminal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-black text-green-400 p-4 rounded-lg font-mono h-[500px] overflow-y-auto">
            {output.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}