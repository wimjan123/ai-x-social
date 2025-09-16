'use client';

import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Avatar,
  Badge,
  Progress,
  Stack,
  Flex,
  Grid,
  GridItem,
  useColorModeValue,
} from '@chakra-ui/react';
import { Heart, MessageCircle, Repeat2, Share, Bookmark } from 'lucide-react';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import {
  type PoliticalAlignment,
  type InfluenceLevel,
  getPoliticalDisplayName,
  getInfluenceDisplayName,
  cn,
} from '@/lib/design-system';

const politicalAlignments: PoliticalAlignment[] = [
  'conservative',
  'liberal',
  'progressive',
  'moderate',
  'libertarian',
  'green',
];

const influenceLevels: InfluenceLevel[] = [
  'minimal',
  'emerging',
  'rising',
  'influential',
  'viral',
];

export function DesignSystemDemo() {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box className="min-h-screen space-y-8 bg-x-background p-8">
      {/* Header */}
      <Flex justify="space-between" align="center" className="mb-8">
        <Heading className="text-gradient-x">
          AI X Social - Design System
        </Heading>
        <DarkModeToggle />
      </Flex>

      <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
        {/* Political Alignment Colors */}
        <GridItem>
          <Card bg={bg} borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Political Alignments</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={3}>
                {politicalAlignments.map(alignment => (
                  <Flex key={alignment} align="center" justify="space-between">
                    <Button variant={`political-${alignment}` as any} size="sm">
                      {getPoliticalDisplayName(alignment)}
                    </Button>
                    <Badge variant={`political-${alignment}` as any}>
                      {alignment}
                    </Badge>
                    <Avatar
                      size="sm"
                      variant={`political-${alignment}` as any}
                      name={getPoliticalDisplayName(alignment)}
                    />
                  </Flex>
                ))}
              </Stack>
            </CardBody>
          </Card>
        </GridItem>

        {/* Influence Levels */}
        <GridItem>
          <Card bg={bg} borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Influence Levels</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={3}>
                {influenceLevels.map((level, index) => (
                  <Box key={level}>
                    <Flex align="center" justify="space-between" mb={2}>
                      <Text fontWeight="medium">
                        {getInfluenceDisplayName(level)}
                      </Text>
                      <Badge variant={`influence-${level}` as any}>
                        {level}
                      </Badge>
                    </Flex>
                    <Progress
                      value={(index + 1) * 20}
                      colorScheme={
                        level === 'viral'
                          ? 'purple'
                          : level === 'influential'
                            ? 'red'
                            : level === 'rising'
                              ? 'orange'
                              : level === 'emerging'
                                ? 'cyan'
                                : 'gray'
                      }
                      variant={
                        level === 'viral'
                          ? ('influence-viral' as any)
                          : undefined
                      }
                      className={cn(level === 'viral' && 'animate-pulse')}
                    />
                  </Box>
                ))}
              </Stack>
            </CardBody>
          </Card>
        </GridItem>

        {/* X-Style Buttons */}
        <GridItem>
          <Card bg={bg} borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">X-Style Buttons</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={3}>
                <Button variant="x-primary">Post</Button>
                <Button variant="x-secondary">Follow</Button>
                <Button variant="x-ghost">Cancel</Button>
                <Button variant="influence-viral">Go Viral!</Button>
              </Stack>
            </CardBody>
          </Card>
        </GridItem>

        {/* Sample Post */}
        <GridItem colSpan={[1, 1, 2]}>
          <Card variant="x-post" bg={bg} borderColor={borderColor}>
            <CardBody className="x-post-content">
              <div className="x-post-header">
                <Avatar
                  size="sm"
                  variant="political-progressive"
                  name="AI Politician"
                  className="avatar-progressive"
                />
                <Box>
                  <Text className="text-x-username font-semibold">
                    @ai_politician
                  </Text>
                  <Text className="text-x-timestamp">2m</Text>
                </Box>
                <Badge variant="influence-viral" className="ml-auto">
                  Viral
                </Badge>
              </div>

              <Text className="x-post-body">
                Just unveiled my new policy proposal for sustainable AI
                governance! This could reshape how we approach technology
                regulation in the digital age. What are your thoughts? 🤖✨
              </Text>

              <div className="x-post-footer">
                <Flex gap={6}>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<MessageCircle size={16} />}
                    className="engagement-comment"
                  >
                    24
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Repeat2 size={16} />}
                    className="engagement-repost"
                  >
                    156
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Heart size={16} />}
                    className="engagement-like"
                  >
                    1.2K
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Share size={16} />}
                    className="engagement-share"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Bookmark size={16} />}
                    className="engagement-bookmark"
                  />
                </Flex>
              </div>
            </CardBody>
          </Card>
        </GridItem>

        {/* Animation Examples */}
        <GridItem>
          <Card bg={bg} borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Animations</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={3}>
                <Button className="animate-fade-in">Fade In</Button>
                <Button className="animate-slide-up">Slide Up</Button>
                <Button className="animate-bounce-gentle">Gentle Bounce</Button>
                <Badge
                  className="animate-political-pulse"
                  variant="political-liberal"
                >
                  Political Pulse
                </Badge>
                <Box className="animate-influence-glow rounded-lg border-2 border-purple-300 p-3">
                  <Text>Influence Glow</Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>
        </GridItem>

        {/* Typography Scale */}
        <GridItem>
          <Card bg={bg} borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Typography</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={2}>
                <Text className="text-x-display">Display Text</Text>
                <Text className="text-x-headline">Headline Text</Text>
                <Text className="text-x-title">Title Text</Text>
                <Text className="text-x-body">Body Text</Text>
                <Text className="text-x-caption">Caption Text</Text>
                <Text className="text-x-username">@username</Text>
                <Text className="text-x-timestamp">5m ago</Text>
              </Stack>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* Responsive Grid Demo */}
      <Card bg={bg} borderColor={borderColor} mt={8}>
        <CardHeader>
          <Heading size="md">Responsive Layout (X-like Grid)</Heading>
        </CardHeader>
        <CardBody>
          <div className="grid min-h-[200px] grid-cols-x-mobile gap-4 md:grid-cols-x-tablet lg:grid-cols-x-layout">
            <div className="hidden rounded-lg bg-blue-100 p-4 dark:bg-blue-900 lg:block">
              <Text>Left Sidebar</Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                Navigation & Profile
              </Text>
            </div>
            <div className="rounded-lg bg-green-100 p-4 dark:bg-green-900">
              <Text>Main Timeline</Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                Posts & Content
              </Text>
            </div>
            <div className="hidden rounded-lg bg-purple-100 p-4 dark:bg-purple-900 xl:block">
              <Text>Right Sidebar</Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                Trends & Suggestions
              </Text>
            </div>
          </div>
        </CardBody>
      </Card>
    </Box>
  );
}

export default DesignSystemDemo;
