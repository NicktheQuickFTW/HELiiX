"use client";

import React, { useState, useEffect } from 'react';
import { 
  Column, 
  Input, 
  Text, 
  Card, 
  Row, 
  Heading, 
  Button 
} from "@once-ui-system/core";

interface CommandItem {
  id: string;
  name: string;
  description?: string;
  keywords?: string[];
  action: () => void;
  icon?: React.ReactNode;
}

interface CommandPaletteProps {
  commands?: CommandItem[];
  placeholder?: string;
  hotkey?: string;
}

export const CommandPalette = ({
  commands = [],
  placeholder = "Type a command or search...",
  hotkey = "k",
}: CommandPaletteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredCommands, setFilteredCommands] = useState<CommandItem[]>(commands);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open command palette with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === hotkey) {
        e.preventDefault();
        setIsOpen(prev => !prev);
        setSearch('');
      }
      
      if (isOpen) {
        // Escape to close
        if (e.key === 'Escape') {
          setIsOpen(false);
        }
        
        // Arrow keys for navigation
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : prev
          );
        }
        
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
        }
        
        // Enter to select
        if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
          e.preventDefault();
          filteredCommands[selectedIndex].action();
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, hotkey]);

  // Filter commands based on search
  useEffect(() => {
    if (search === '') {
      setFilteredCommands(commands);
    } else {
      const filtered = commands.filter(command => {
        const searchLower = search.toLowerCase();
        return (
          command.name.toLowerCase().includes(searchLower) || 
          (command.description && command.description.toLowerCase().includes(searchLower)) ||
          (command.keywords && command.keywords.some(kw => kw.toLowerCase().includes(searchLower)))
        );
      });
      setFilteredCommands(filtered);
    }
    setSelectedIndex(0);
  }, [search, commands]);

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 1rem'
      }}
      onClick={() => setIsOpen(false)}
    >
      <Card
        style={{ 
          width: '100%', 
          maxWidth: '550px',
          maxHeight: '80vh',
          overflow: 'hidden',
          borderRadius: '8px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
        }}
        padding="m"
        background="surface"
        onClick={(e) => e.stopPropagation()}
      >
        <Column gap="m" style={{ width: '100%' }}>
          <Input
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            variant="search"
            size="l"
          />
          
          <div style={{ overflowY: 'auto', maxHeight: '60vh' }}>
            <Column gap="s">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((command, index) => (
                  <div 
                    key={command.id}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      backgroundColor: selectedIndex === index ? 
                        'var(--brand-background-alpha-weak)' : 'transparent',
                    }}
                    onClick={() => {
                      command.action();
                      setIsOpen(false);
                    }}
                  >
                    <Row gap="m" style={{ alignItems: "center" }}>
                      {command.icon && (
                        <div style={{ opacity: 0.7 }}>
                          {command.icon}
                        </div>
                      )}
                      <Column gap="xs">
                        <Text variant="body-strong-m">{command.name}</Text>
                        {command.description && (
                          <Text variant="body-default-s" onBackground="neutral-weak">
                            {command.description}
                          </Text>
                        )}
                      </Column>
                    </Row>
                  </div>
                ))
              ) : (
                <div style={{ padding: '1rem', textAlign: 'center' }}>
                  <Text variant="body-default-m" onBackground="neutral-weak">
                    No commands found
                  </Text>
                </div>
              )}
            </Column>
          </div>
          
          <Row gap="s" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <Text variant="body-default-xs" onBackground="neutral-weak">
              Navigate with ↑↓, select with Enter
            </Text>
            <Button 
              variant="ghost"
              size="s"
              onClick={() => setIsOpen(false)}
            >
              ESC to close
            </Button>
          </Row>
        </Column>
      </Card>
    </div>
  );
};
