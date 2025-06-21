#!/usr/bin/env node
import { intro, outro, select, group, text, confirm, multiselect, isCancel } from '@clack/prompts';
import chalk from 'chalk';
import { Command } from 'commander';
import path from 'path';
import { createApp } from './create.js';
import { isPackageManagerInstalled } from './utils.js';

const program = new Command()
  .name('create-harvide-starter')
  .description('Create a new Harvide Starter project')
  .version('0.0.1')
  .argument('[directory]', 'Where to create the project')
  .option('--use-npm', 'Bootstrap the application using npm')
  .option('--use-pnpm', 'Bootstrap the application using pnpm')
  .option('--use-yarn', 'Bootstrap the application using yarn')
  .option('--use-bun', 'Bootstrap the application using bun')
  // .option('--pro', 'Use Starter Pro')
  .parse(process.argv);

async function main() {
  intro(chalk.bold('Create Harvide Starter Project'));

  const [directory] = program.args;
  
  // Determine package manager from flags
  const packageManagerFlag = program.opts();
  const selectedPackageManager = 
    packageManagerFlag['useNpm'] ? 'npm' :
    packageManagerFlag['usePnpm'] ? 'pnpm' :
    packageManagerFlag['useYarn'] ? 'yarn' :
    packageManagerFlag['useBun'] ? 'bun' :
    undefined;

  const answers = await group({
      isStarter: () =>
        select({
        message: 'Would you like to use Starter Pro?',
        options: [
          { value: 'basic', label: 'No, use basic starter' },
          { value: 'pro', label: 'Yes, use Starter Pro (coming soon)', hint: '✨' },
        ],
        initialValue: 'basic',
      }),
    
    projectPath: () =>
      text({
        message: 'Where would you like to create your project?',
        placeholder: './my-app',
        initialValue: directory || '',
        validate: (value: string) => {
          if (!value) return 'Please enter a directory name';
        },
      }),

    packageManager: () =>
      selectedPackageManager ? 
        selectedPackageManager :
        select({
          message: 'Select preferred package manager',
          options: [
            { value: 'npm' as const, label: `npm ${!isPackageManagerInstalled('npm') && '(not installed)'}` },
            { value: 'yarn' as const, label: `yarn ${!isPackageManagerInstalled('yarn') && '(not installed)'}` },
            { value: 'pnpm' as const, label: `pnpm ${!isPackageManagerInstalled('pnpm') && '(not installed)'}` },
            { value: 'bun' as const, label: `bun ${!isPackageManagerInstalled('bun') && '(not installed)'}`, hint: 'recommended' },
          ],
          initialValue: 'bun',
        }),

    name: () =>
      text({
        message: 'What is your application name?',
        placeholder: 'My Awesome App',
        validate: (value: string) => {
          if (!value) return 'Please enter an application name';
        },
      }),

    description: () =>
      text({
        message: 'Brief description of your application (optional)',
        placeholder: 'A powerful application for managing tasks',
      }),

    features: () =>
      multiselect({
        message: 'Select features to include',
        options: [
          { value: 'web' as const, label: 'Web Application', hint: 'Next.js' },
          { value: 'docs' as const, label: 'Documentation Site', hint: 'Nextra' },
          { value: 'mobile' as const, label: 'Mobile App', hint: 'Coming soon' },
        ],
        required: true,
      }),

    auth: ({ results }) => {
      const features = (results as any).features;
      return features?.includes('web')
        ? multiselect({
            message: 'Select authentication methods',
            options: [
              { value: 'email' as const, label: 'Email/Password', hint: 'recommended' },
              { value: 'phone' as const, label: 'Phone Number' },
              { value: 'social' as const, label: 'Social Providers', hint: 'Google, GitHub, etc.' },
            ],
            required: true,
          })
        : null;
    },

    socialProviders: ({ results }) => {
      const auth = (results as any).auth;
      return auth?.includes('social')
        ? multiselect({
            message: 'Select social providers',
            options: [
              { value: 'google' as const, label: 'Google' },
              { value: 'github' as const, label: 'GitHub' },
              { value: 'facebook' as const, label: 'Facebook' },
              { value: 'apple' as const, label: 'Apple', hint: 'Includes Sign in with Apple setup' },
              { value: 'twitter' as const, label: 'Twitter' },
              { value: 'discord' as const, label: 'Discord' },
              { value: 'linkedin' as const, label: 'LinkedIn' },
            ],
            required: true,
          })
        : null;
    },
  } as const);

  if (isCancel(answers)) {
    outro(chalk.red('Operation cancelled'));
    process.exit(1);
  }

  // Handle Pro version (currently disabled)
  if ((answers as any).isStarter === 'pro') {
    outro(chalk.yellow('Starter Pro is coming soon! Using basic starter instead.'));
  }

  try {
    const projectOptions = {
      projectPath: path.resolve(process.cwd(), (answers as any).projectPath),
      appName: (answers as any).name,
      description: (answers as any).description || '',
      packageManager: (answers as any).packageManager,
      features: (answers as any).features,
      auth: (answers as any).auth,
      socialProviders: (answers as any).socialProviders,
    };

    const result = await createApp(projectOptions);
    
    outro(`
✨ ${chalk.green('Project created successfully!')}

${chalk.blue('Next steps:')}
  ${chalk.cyan(`cd ${result.projectPath}`)}
  ${chalk.cyan(`${result.packageManager} dev`)}

To learn more, see the docs: ${chalk.cyan('https://starter.harvide.com')}
`);
  } catch (error) {
    outro(chalk.red(`Failed to create project: ${(error as Error).message}`));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(chalk.red('✖'), err.message);
  process.exit(1);
});
