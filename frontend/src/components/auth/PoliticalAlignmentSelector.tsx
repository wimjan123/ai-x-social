'use client';

import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  FormControl,
  FormLabel,
  Textarea,
  SimpleGrid,
  Badge,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Flag, TrendingUp, Scale, Heart, Users } from 'lucide-react';
import type { PoliticalAlignment } from '@/types';

interface PoliticalAlignmentSelectorProps {
  value?: Partial<PoliticalAlignment>;
  onChange: (alignment: PoliticalAlignment) => void;
  className?: string;
}

const politicalPositions = [
  {
    id: 'conservative' as const,
    label: 'Conservative',
    icon: Flag,
    color: 'political-conservative-500',
    bgColor: 'political.conservative.50',
    borderColor: 'political.conservative.500',
    description: 'Traditional values, limited government, free markets',
    gradient: 'bg-political-gradient-conservative',
  },
  {
    id: 'liberal' as const,
    label: 'Liberal',
    icon: Scale,
    color: 'political-liberal-500',
    bgColor: 'political.liberal.50',
    borderColor: 'political.liberal.500',
    description: 'Social equality, progressive reform, government intervention',
    gradient: 'bg-political-gradient-liberal',
  },
  {
    id: 'progressive' as const,
    label: 'Progressive',
    icon: TrendingUp,
    color: 'political-progressive-500',
    bgColor: 'political.progressive.50',
    borderColor: 'political.progressive.500',
    description: 'Systemic change, social justice, environmental action',
    gradient: 'bg-political-gradient-progressive',
  },
  {
    id: 'libertarian' as const,
    label: 'Libertarian',
    icon: Users,
    color: 'political-libertarian-500',
    bgColor: 'political.libertarian.50',
    borderColor: 'political.libertarian.500',
    description: 'Maximum individual freedom, minimal government',
    gradient: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
  },
  {
    id: 'independent' as const,
    label: 'Independent',
    icon: Heart,
    color: 'political-moderate-500',
    bgColor: 'political.moderate.50',
    borderColor: 'political.moderate.500',
    description: 'Issue-based positions, non-partisan approach',
    gradient: 'bg-gradient-to-r from-cyan-400 to-cyan-600',
  },
];

const commonIssues = [
  'Healthcare Reform',
  'Climate Change',
  'Economic Policy',
  'Immigration',
  'Education',
  'Gun Rights',
  'Criminal Justice',
  'Foreign Policy',
  'Tax Policy',
  'Social Security',
  'Infrastructure',
  'Technology Regulation',
];

export function PoliticalAlignmentSelector({
  value,
  onChange,
  className,
}: PoliticalAlignmentSelectorProps) {
  const [selectedPosition, setSelectedPosition] = useState<
    PoliticalAlignment['position']
  >(value?.position || 'independent');
  const [intensity, setIntensity] = useState(value?.intensity || 5);
  const [selectedIssues, setSelectedIssues] = useState<string[]>(
    value?.keyIssues || []
  );
  const [description, setDescription] = useState(value?.description || '');

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.900', 'white');

  const handlePositionSelect = (position: PoliticalAlignment['position']) => {
    setSelectedPosition(position);
    updateAlignment({
      position,
      intensity,
      keyIssues: selectedIssues,
      description,
    });
  };

  const handleIntensityChange = (newIntensity: number) => {
    setIntensity(newIntensity);
    updateAlignment({
      position: selectedPosition,
      intensity: newIntensity,
      keyIssues: selectedIssues,
      description,
    });
  };

  const handleIssueToggle = (issue: string) => {
    const newIssues = selectedIssues.includes(issue)
      ? selectedIssues.filter((i) => i !== issue)
      : [...selectedIssues, issue];
    
    setSelectedIssues(newIssues);
    updateAlignment({
      position: selectedPosition,
      intensity,
      keyIssues: newIssues,
      description,
    });
  };

  const handleDescriptionChange = (newDescription: string) => {
    setDescription(newDescription);
    updateAlignment({
      position: selectedPosition,
      intensity,
      keyIssues: selectedIssues,
      description: newDescription,
    });
  };

  const updateAlignment = (alignment: PoliticalAlignment) => {
    onChange(alignment);
  };

  const selectedPositionData = politicalPositions.find(
    (p) => p.id === selectedPosition
  );

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
            <Flag size={20} />
            Political Alignment
          </Text>
          <Text fontSize="sm" color="gray.500">
            Choose your political position and customize your profile
          </Text>
        </Box>

        {/* Position Selection */}
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">
            Political Position
          </FormLabel>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3}>
            {politicalPositions.map((position) => {
              const Icon = position.icon;
              const isSelected = selectedPosition === position.id;
              
              return (
                <Tooltip
                  key={position.id}
                  label={position.description}
                  placement="top"
                  hasArrow
                >
                  <Button
                    onClick={() => handlePositionSelect(position.id)}
                    variant={isSelected ? 'solid' : 'outline'}
                    colorScheme={isSelected ? 'blue' : 'gray'}
                    h="auto"
                    p={4}
                    className={`
                      transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg
                      ${isSelected ? 'ring-2 ring-opacity-50 ' + position.color : ''}
                      ${isSelected ? position.gradient : ''}
                    `}
                    border="2px"
                    borderColor={isSelected ? position.borderColor : borderColor}
                    bg={isSelected ? position.bgColor : 'transparent'}
                    _hover={{
                      borderColor: position.borderColor,
                      bg: position.bgColor,
                    }}
                  >
                    <VStack spacing={2}>
                      <Icon
                        size={24}
                        className={`text-${position.color}`}
                      />
                      <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        color={isSelected ? 'white' : textColor}
                      >
                        {position.label}
                      </Text>
                    </VStack>
                  </Button>
                </Tooltip>
              );
            })}
          </SimpleGrid>
        </FormControl>

        {/* Intensity Slider */}
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">
            Political Intensity
            <Badge ml={2} colorScheme="blue" variant="subtle">
              {intensity}/10
            </Badge>
          </FormLabel>
          <Box px={4}>
            <Slider
              value={intensity}
              onChange={handleIntensityChange}
              min={1}
              max={10}
              step={1}
              colorScheme="blue"
            >
              <SliderTrack bg={useColorModeValue('gray.200', 'gray.600')}>
                <SliderFilledTrack bg={selectedPositionData?.color || 'blue.500'} />
              </SliderTrack>
              <SliderThumb boxSize={6} className="animate-political-pulse">
                <Box
                  w={3}
                  h={3}
                  bg={selectedPositionData?.color || 'blue.500'}
                  rounded="full"
                />
              </SliderThumb>
            </Slider>
            <HStack justify="space-between" mt={2}>
              <Text fontSize="xs" color="gray.500">
                Moderate
              </Text>
              <Text fontSize="xs" color="gray.500">
                Strong
              </Text>
            </HStack>
          </Box>
        </FormControl>

        {/* Key Issues */}
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">
            Key Issues
            <Badge ml={2} colorScheme="blue" variant="subtle">
              {selectedIssues.length} selected
            </Badge>
          </FormLabel>
          <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={2}>
            {commonIssues.map((issue) => {
              const isSelected = selectedIssues.includes(issue);
              return (
                <Button
                  key={issue}
                  onClick={() => handleIssueToggle(issue)}
                  variant={isSelected ? 'solid' : 'outline'}
                  size="sm"
                  colorScheme={isSelected ? 'blue' : 'gray'}
                  className="transition-all duration-200"
                  bg={isSelected ? selectedPositionData?.color : 'transparent'}
                  borderColor={
                    isSelected ? selectedPositionData?.borderColor : borderColor
                  }
                  _hover={{
                    bg: selectedPositionData?.bgColor,
                    borderColor: selectedPositionData?.borderColor,
                  }}
                >
                  <Text fontSize="xs" isTruncated>
                    {issue}
                  </Text>
                </Button>
              );
            })}
          </SimpleGrid>
        </FormControl>

        {/* Description */}
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">
            Personal Statement (Optional)
          </FormLabel>
          <Textarea
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Describe your political views in your own words..."
            rows={3}
            resize="vertical"
            bg={useColorModeValue('gray.50', 'gray.700')}
            border="1px"
            borderColor={borderColor}
            _hover={{
              borderColor: useColorModeValue('gray.300', 'gray.500'),
            }}
            _focus={{
              borderColor: selectedPositionData?.borderColor || 'blue.500',
              boxShadow: '0 0 0 1px ' + (selectedPositionData?.color || 'rgb(59 130 246)') + ' / 0.5',
            }}
          />
          <Text fontSize="xs" color="gray.500" mt={1}>
            {description.length}/500 characters
          </Text>
        </FormControl>

        {/* Preview */}
        {(selectedPosition !== 'independent' || selectedIssues.length > 0) && (
          <Box
            p={4}
            bg={selectedPositionData?.bgColor}
            border="1px"
            borderColor={selectedPositionData?.borderColor}
            rounded="lg"
            className="animate-fade-in"
          >
            <Text fontSize="sm" fontWeight="medium" mb={2}>
              Alignment Preview
            </Text>
            <HStack spacing={4} wrap="wrap">
              <Badge
                colorScheme="blue"
                variant="solid"
                bg={selectedPositionData?.color}
                className="flex items-center gap-1"
              >
                {selectedPositionData && <selectedPositionData.icon size={12} />}
                {selectedPositionData?.label}
              </Badge>
              <Badge colorScheme="gray" variant="outline">
                Intensity: {intensity}/10
              </Badge>
              {selectedIssues.length > 0 && (
                <Badge colorScheme="purple" variant="outline">
                  {selectedIssues.length} key issues
                </Badge>
              )}
            </HStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
}

export default PoliticalAlignmentSelector;