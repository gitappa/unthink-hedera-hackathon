'use client';

import { Button } from '@/components/ui/button';
import { Bot, User2 } from 'lucide-react'; // Using Bot for consistency
import { cn } from '@/lib/utils'; // Make sure you have cn utility

// Define Assistant type directly here or import if defined elsewhere
interface Assistant {
    id: string;
    icon: React.ReactNode;
    name: React.ReactNode; // Can be string or JSX
}

// Define assistants
const assistants: Assistant[] = [
    { id: 'SAM', icon: <Bot className="w-5 h-5 text-blue-500" />, name: "" },
    // Add more assistants here if needed
    // { id: 'user_2', icon: <User2 className="w-5 h-5 text-red-500" />, name: "Assistant 2" },
];

interface AssistantSelectorProps {
    selectedId: string;
    onSelect: (id: string) => void;
}

export function AssistantSelector({ selectedId, onSelect }: AssistantSelectorProps) {
    return (
        // Increased padding, flex-col to stack buttons
        <div className="flex flex-col gap-1 p-2 flex-1 overflow-y-auto">
            {assistants.map((assistant) => (
                <Button
                    key={assistant.id}
                    variant={selectedId === assistant.id ? "secondary" : "ghost"} // Use secondary for selected
                    // Improved styling: full width, left align, padding, transition
                    className={cn(
                        "w-full justify-start gap-3 h-10 px-3 transition-colors duration-150 ease-in-out",
                        selectedId === assistant.id
                            ? "font-semibold bg-muted hover:bg-muted" // More prominent selected state
                            : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => onSelect(assistant.id)}
                >
                    {/* Icon styling */}
                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                      {assistant.icon}
                    </div>
                    {/* Text styling: hide on small, show on medium+, adjust font */}
                    <span className="hidden md:inline text-sm truncate">
                        {assistant.name}
                    </span>
                </Button>
            ))}
        </div>
    );
}