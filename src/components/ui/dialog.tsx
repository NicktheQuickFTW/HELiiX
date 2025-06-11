"use client";

import { Column, Row, Button, Heading, Text, Card } from "@once-ui-system/core";
import { forwardRef, createContext, useContext, useState, type ReactNode, type MouseEvent } from "react";

interface DialogContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export interface DialogProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Dialog = (props: DialogProps) => {
  const { children, open, onOpenChange } = props;
  const [internalOpen, setInternalOpen] = useState(false);
  const currentOpen = open ?? internalOpen;
  
  const handleOpenChange = (newOpen: boolean) => {
    if (open === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <DialogContext.Provider value={{ open: currentOpen, setOpen: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

Dialog.displayName = "Dialog";

interface DialogTriggerProps {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  [key: string]: any;
}

const DialogTrigger = (props: DialogTriggerProps) => {
  const { children, onClick, ...rest } = props;
  const context = useContext(DialogContext);
  
  if (!context) {
    throw new Error("DialogTrigger must be used within a Dialog");
  }
  
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    context.setOpen(true);
    onClick?.(e);
  };
  
  return (
    <Button onClick={handleClick} {...rest}>
      {children}
    </Button>
  );
};

DialogTrigger.displayName = "DialogTrigger";

interface DialogContentProps {
  children: ReactNode;
  [key: string]: any;
}

const DialogContent = (props: DialogContentProps) => {
  const { children, ...rest } = props;
  const context = useContext(DialogContext);
  
  if (!context || !context.open) {
    return null;
  }

  const handleBackdropClick = () => {
    context.setOpen(false);
  };
  
  // Define handleCardClick separately to avoid type errors
  function handleCardClick(e: React.MouseEvent) {
    e.stopPropagation();
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={handleBackdropClick}
    >
      <Card
        padding="l"
        style={{ maxWidth: "28rem", width: "100%" }}
        onClick={handleCardClick as any}
        {...rest}
      >
        {children}
      </Card>
    </div>
  );
};

DialogContent.displayName = "DialogContent";

interface DialogHeaderProps {
  children: ReactNode;
}

const DialogHeader = ({ children }: DialogHeaderProps) => {
  return (
    <Column gap="s" paddingBottom="m">
      {children}
    </Column>
  );
};

DialogHeader.displayName = "DialogHeader";

interface DialogTitleProps {
  children: ReactNode;
}

const DialogTitle = ({ children }: DialogTitleProps) => {
  return (
    <Heading variant="heading-strong-l">
      {children}
    </Heading>
  );
};

DialogTitle.displayName = "DialogTitle";

interface DialogDescriptionProps {
  children: ReactNode;
}

const DialogDescription = ({ children }: DialogDescriptionProps) => {
  return (
    <Text variant="body-default-m" color="neutral-weak">
      {children}
    </Text>
  );
};

DialogDescription.displayName = "DialogDescription";

interface DialogFooterProps {
  children: ReactNode;
}

const DialogFooter = ({ children }: DialogFooterProps) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'row',
      gap: 'var(--spacing-s)',
      paddingTop: 'var(--spacing-m)',
      justifyContent: 'flex-end', 
      alignItems: 'center' 
    }}>
      {children}
    </div>
  );
};

DialogFooter.displayName = "DialogFooter";

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
};