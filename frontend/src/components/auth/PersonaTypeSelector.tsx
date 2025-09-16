'use client';

import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  SimpleGrid,
  Badge,
  useColorModeValue,
  Tooltip,
  FormControl,
  FormLabel,
  Textarea,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
  User,
  Crown,
  Megaphone,
  BookOpen,
  Briefcase,
  Users,
  Star,
  Mic,
  Camera,
} from 'lucide-react';

type PersonaType =
  | 'politician'
  | 'influencer'
  | 'journalist'
  | 'business_leader'
  | 'activist'
  | 'celebrity'
  | 'podcaster'
  | 'content_creator'
  | 'regular_user';

interface PersonaTypeData {
  id: PersonaType;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
  features: string[];
  color: string;
  bgColor: string;
  borderColor: string;
  influenceLevel: 'Low' | 'Medium' | 'High' | 'Very High';
}

interface PersonaTypeSelectorProps {
  value?: PersonaType;
  onChange: (type: PersonaType, customization?: string) => void;
  className?: string;
}

const personaTypes: PersonaTypeData[] = [
  {
    id: 'politician',
    label: 'Politician',
    icon: Crown,
    description: 'Elected official or political candidate',
    features: ['Policy discussions', 'Campaign updates', 'Voting records', 'Constituency engagement'],
    color: 'red.600',
    bgColor: 'red.50',
    borderColor: 'red.500',
    influenceLevel: 'Very High',
  },
  {
    id: 'influencer',
    label: 'Social Influencer',
    icon: Megaphone,
    description: 'Opinion leader with significant following',
    features: ['Trend setting', 'Brand partnerships', 'Community building', 'Viral content'],
    color: 'orange.600',
    bgColor: 'orange.50',
    borderColor: 'orange.500',
    influenceLevel: 'High',
  },
  {
    id: 'journalist',
    label: 'Journalist',
    icon: BookOpen,
    description: 'News reporter or media personality',
    features: ['Breaking news', 'Investigative reporting', 'Interview content', 'Media analysis'],
    color: 'blue.600',
    bgColor: 'blue.50',
    borderColor: 'blue.500',
    influenceLevel: 'High',
  },
  {
    id: 'business_leader',
    label: 'Business Leader',
    icon: Briefcase,
    description: 'CEO, entrepreneur, or industry expert',
    features: ['Market insights', 'Industry trends', 'Leadership advice', 'Business updates'],
    color: 'yellow.600',
    bgColor: 'yellow.50',
    borderColor: 'yellow.500',
    influenceLevel: 'High',
  },
  {
    id: 'activist',
    label: 'Activist',
    icon: Users,
    description: 'Social or political change advocate',
    features: ['Cause awareness', 'Movement organizing', 'Social justice', 'Community action'],
    color: 'purple.600',
    bgColor: 'purple.50',
    borderColor: 'purple.500',
    influenceLevel: 'Medium',
  },
  {
    id: 'celebrity',
    label: 'Celebrity',
    icon: Star,
    description: 'Entertainment or sports personality',
    features: ['Entertainment content', 'Fan engagement', 'Personal brand', 'Cultural influence'],
    color: 'pink.600',
    bgColor: 'pink.50',
    borderColor: 'pink.500',
    influenceLevel: 'Very High',
  },
  {
    id: 'podcaster',
    label: 'Podcaster',
    icon: Mic,
    description: 'Audio content creator and host',
    features: ['Long-form discussions', 'Expert interviews', 'Topic deep-dives', 'Audience Q&A'],
    color: 'cyan.600',
    bgColor: 'cyan.50',
    borderColor: 'cyan.500',
    influenceLevel: 'Medium',
  },
  {
    id: 'content_creator',
    label: 'Content Creator',
    icon: Camera,
    description: 'Digital content producer',
    features: ['Creative content', 'Tutorial videos', 'Behind-the-scenes', 'Community interaction'],
    color: 'teal.600',
    bgColor: 'teal.50',
    borderColor: 'teal.500',
    influenceLevel: 'Medium',
  },
  {
    id: 'regular_user',
    label: 'Regular User',
    icon: User,
    description: 'General social media participant',
    features: ['Personal posts', 'Community discussions', 'News sharing', 'Opinion sharing'],
    color: 'gray.600',
    bgColor: 'gray.50',
    borderColor: 'gray.500',
    influenceLevel: 'Low',
  },
];

const getInfluenceBadgeColor = (level: string) => {
  switch (level) {
    case 'Very High':
      return 'red';
    case 'High':
      return 'orange';
    case 'Medium':
      return 'blue';
    case 'Low':
      return 'gray';
    default:
      return 'gray';
  }
};

export function PersonaTypeSelector({
  value,
  onChange,
  className,
}: PersonaTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<PersonaType>(
    value || 'regular_user'
  );
  const [customization, setCustomization] = useState('');

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.900', 'white');

  const handleTypeSelect = (type: PersonaType) => {
    setSelectedType(type);
    onChange(type, customization);
  };

  const handleCustomizationChange = (newCustomization: string) => {
    setCustomization(newCustomization);
    onChange(selectedType, newCustomization);
  };

  const selectedTypeData = personaTypes.find((t) => t.id === selectedType);

  return (
    <Box className={className} bg={bgColor} rounded="xl" p={6}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color={textColor}
            mb={2}
            className="flex items-center gap-2"
          >
            <User size={20} />
            Account Type
          </Text>
          <Text fontSize="sm" color="gray.500">
            Choose your account type to customize your experience
          </Text>
        </Box>

        {/* Type Selection */}
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">
            Account Type
          </FormLabel>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {personaTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;

              return (
                <Tooltip
                  key={type.id}
                  label={type.description}
                  placement="top"
                  hasArrow
                >
                  <Button
                    onClick={() => handleTypeSelect(type.id)}
                    variant="outline"
                    h="auto"
                    p={4}
                    className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                    border="2px"
                    borderColor={isSelected ? type.borderColor : borderColor}
                    bg={isSelected ? type.bgColor : 'transparent'}
                    _hover={{
                      borderColor: type.borderColor,
                      bg: type.bgColor,
                      transform: 'translateY(-2px)',
                      shadow: 'lg',
                    }}
                  >
                    <VStack spacing={3} w="full">
                      <HStack justify="space-between" w="full">
                        <Icon size={24} />
                        <Badge
                          colorScheme={getInfluenceBadgeColor(type.influenceLevel)}
                          fontSize="xs"
                        >
                          {type.influenceLevel}
                        </Badge>
                      </HStack>

                      <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        color={textColor}
                        textAlign="center"
                      >
                        {type.label}
                      </Text>

                      <Text
                        fontSize="xs"
                        color="gray.500"
                        textAlign="center"
                        noOfLines={2}
                      >
                        {type.description}
                      </Text>
                    </VStack>
                  </Button>
                </Tooltip>
              );
            })}
          </SimpleGrid>
        </FormControl>

        {/* Selected Type Features */}
        {selectedTypeData && (
          <Box
            p={4}
            bg={selectedTypeData.bgColor}
            border="1px"
            borderColor={selectedTypeData.borderColor}
            rounded="lg"
            className="animate-fade-in"
          >
            <Text fontSize="sm" fontWeight="medium" mb={3}>
              {selectedTypeData.label} Features
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
              {selectedTypeData.features.map((feature, index) => (
                <HStack key={index} spacing={2}>
                  <Box
                    w={2}
                    h={2}
                    bg={selectedTypeData.color}
                    rounded="full"
                    className="animate-political-pulse"
                  />
                  <Text fontSize="xs" color="gray.600">
                    {feature}
                  </Text>
                </HStack>
              ))}
            </SimpleGrid>
          </Box>
        )}

        {/* Customization */}
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">
            Additional Details (Optional)
          </FormLabel>
          <Textarea
            value={customization}
            onChange={(e) => handleCustomizationChange(e.target.value)}
            placeholder={`Tell us more about your role as a ${selectedTypeData?.label.toLowerCase()}...`}
            rows={3}
            resize="vertical"
            bg={useColorModeValue('gray.50', 'gray.700')}
            border="1px"
            borderColor={borderColor}
            _hover={{
              borderColor: useColorModeValue('gray.300', 'gray.500'),
            }}
            _focus={{
              borderColor: selectedTypeData?.borderColor || 'blue.500',
              boxShadow: `0 0 0 1px ${selectedTypeData?.color || 'rgb(59 130 246)'} / 0.5`,
            }}
          />
          <Text fontSize="xs" color="gray.500" mt={1}>
            {customization.length}/300 characters
          </Text>
        </FormControl>

        {/* Account Type Preview */}
        <Box
          p={4}
          bg={useColorModeValue('blue.50', 'blue.900')}
          border="1px"
          borderColor={useColorModeValue('blue.200', 'blue.700')}
          rounded="lg"
          className="animate-fade-in"
        >
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            Account Preview
          </Text>
          <HStack spacing={4} wrap="wrap">
            <Badge
              colorScheme="blue"
              className="flex items-center gap-1"
            >
              {selectedTypeData && <selectedTypeData.icon size={12} />}
              {selectedTypeData?.label}
            </Badge>
            <Badge
              colorScheme={getInfluenceBadgeColor(selectedTypeData?.influenceLevel || 'Low')}
            >
              {selectedTypeData?.influenceLevel} Influence
            </Badge>
            {selectedTypeData?.features.length && (
              <Badge colorScheme="purple">
                {selectedTypeData.features.length} features
              </Badge>
            )}
          </HStack>
          {customization && (
            <Text fontSize="xs" color="gray.600" mt={2} fontStyle="italic">
              "{customization.slice(0, 100)}{customization.length > 100 ? '...' : ''}"
            </Text>
          )}
        </Box>
      </VStack>
    </Box>
  );
}

export default PersonaTypeSelector;