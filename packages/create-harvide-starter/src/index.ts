#!/usr/bin/env node
import path from 'node:path';
import {
  group,
  intro,
  isCancel,
  multiselect,
  outro,
  select,
  text,
} from '@clack/prompts';
import chalk from 'chalk';
import { Command } from 'commander';
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
  const selectedPackageManager = packageManagerFlag.useNpm
    ? 'npm'
    : packageManagerFlag.usePnpm
      ? 'pnpm'
      : packageManagerFlag.useYarn
        ? 'yarn'
        : packageManagerFlag.useBun
          ? 'bun'
          : undefined;

  const answers = await group({
    isStarter: () =>
      select({
        message: 'Would you like to use Starter Pro?',
        options: [
          { value: 'basic', label: 'No, use basic starter' },
          {
            value: 'pro',
            label: 'Yes, use Starter Pro (coming soon)',
            hint: '✨',
          },
        ],
        initialValue: 'basic',
      }),

    projectPath: () =>
      text({
        message: 'Where would you like to create your project?',
        placeholder: './my-app',
        initialValue: directory || '',
        validate: (value: string) => {
          if (!value) {
            return 'Please enter a directory name';
          }
        },
      }),

    packageManager: async () => {
      if (selectedPackageManager) {
        return selectedPackageManager;
      }

      const npmInstalled = await isPackageManagerInstalled('npm').catch(
        () => false
      );
      const yarnInstalled = await isPackageManagerInstalled('yarn').catch(
        () => false
      );
      const pnpmInstalled = await isPackageManagerInstalled('pnpm').catch(
        () => false
      );
      const bunInstalled = await isPackageManagerInstalled('bun').catch(
        () => false
      );

      return select({
        message: 'Select preferred package manager',
        options: [
          {
            value: 'npm' as const,
            label: `npm ${npmInstalled ? '' : '(not installed)'}`,
          },
          {
            value: 'yarn' as const,
            label: `yarn ${yarnInstalled ? '' : '(not installed)'}`,
          },
          {
            value: 'pnpm' as const,
            label: `pnpm ${pnpmInstalled ? '' : '(not installed)'}`,
          },
          {
            value: 'bun' as const,
            label: `bun ${bunInstalled ? '' : '(not installed)'}`,
            hint: 'recommended',
          },
        ],
        initialValue: 'bun',
      });
    },

    name: () =>
      text({
        message: 'What is your application name?',
        placeholder: 'My Awesome App',
        validate: (value: string) => {
          if (!value) {
            return 'Please enter an application name';
          }
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
          {
            value: 'admin' as const,
            label: 'Admin Panel',
            hint: 'Enable admin panel',
          },
        ],
        required: true,
      }),

    auth: ({ results }) => {
      const features = (results as any).features;
      return features?.includes('web')
        ? multiselect({
            message: 'Select authentication methods',
            options: [
              {
                value: 'email' as const,
                label: 'Email/Password',
                hint: 'recommended',
              },
              { value: 'phone' as const, label: 'Phone Number' },
              {
                value: 'social' as const,
                label: 'Social Providers',
                hint: 'Google, GitHub, etc.',
              },
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
              { value: 'apple' as const, label: 'Apple' },
              { value: 'twitter' as const, label: 'Twitter' },
              { value: 'discord' as const, label: 'Discord' },
              { value: 'linkedin' as const, label: 'LinkedIn' },
            ],
            required: true,
          })
        : null;
    },

    mailProvider: ({ results }) => {
      const features = (results as any).features;
      const auth = (results as any).auth;
      return features?.includes('web') && auth?.includes('email')
        ? select({
            message: 'Select email provider',
            options: [
              {
                value: 'resend' as const,
                label: 'Resend',
                hint: 'recommended',
              },
              { value: 'smtp' as const, label: 'SMTP' },
            ],
            initialValue: 'resend',
          })
        : null;
    },

    llm: () =>
      select({
        message: 'Which editor rules do you want to enable (optional)?',
        options: [
          { value: 'claude', label: 'Claude Code' },
          { value: 'cursor', label: 'Cursor' },
          { value: 'windsurf', label: 'Windsurf' },
          { value: 'copilot', label: 'GitHub Copilot (VSCode)' },
          { value: 'zed', label: 'Zed' },
          { value: 'codex', label: 'OpenAI Codex' },
          { value: 'none', label: 'None / I will configure manually' },
        ],
        initialValue: 'none',
      }),
  } as const);

  if (isCancel(answers)) {
    outro(chalk.red('Operation cancelled'));
    process.exit(1);
  }

  // Handle Pro version (currently disabled)
  if ((answers as any).isStarter === 'pro') {
    outro(
      chalk.yellow('Starter Pro is coming soon! Using basic starter instead.')
    );
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
      mailProvider: (answers as any).mailProvider, // Pass mailProvider
      llm: (answers as any).llm,
    };

    const result = await createApp(projectOptions);

    if (!result) {
      throw new Error('Failed to create project');
    }

    let nextSteps = `
✨ ${chalk.green('Project created successfully!')}

${chalk.blue('Next steps:')}
  ${chalk.cyan(`cd ${result.projectPath}`)}
  ${chalk.cyan(`${result.packageManager} dev`)}
`;

    if (projectOptions.features.includes('admin')) {
      nextSteps += `
${chalk.yellow('Important: Configure your Admin Panel!')}
  Head to ${chalk.cyan('http://localhost:3000/admin/signin')} immediately to create your admin user before someone else does!
`;
    }

    nextSteps += `
To learn more, see the docs: ${chalk.cyan('https://starter.harvide.com')}
`;

    outro(nextSteps);
  } catch (error) {
    outro(chalk.red(`Failed to create project: ${(error as Error).message}`));
    process.exit(1);
  }
}

main().catch((_err) => {
  process.exit(1);
});
