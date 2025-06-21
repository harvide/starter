import fs from 'fs-extra';
import path from 'path';
import { execa } from 'execa';
import type { CreateAppOptions } from './types.js';
import { ensurePackageManager, installDependencies } from './utils.js';
import { createSpinner } from './spinner.js';
import { updateAuthConfig } from './auth-config.js';
import { generateConfig } from './config.js';

export async function createApp(options: CreateAppOptions) {
  const { projectPath, appName, description, features, auth, packageManager } = options;
  const templatePath = path.resolve(process.cwd(), '../..');

  let spin = createSpinner('Creating project directory');
  await fs.ensureDir(projectPath);
  spin.success('Project directory created');

  spin = createSpinner('Copying base files');
  const filesToCopy = [
    '.gitignore',
    'turbo.json',
    'bun.lock',
    'package.json',
    'README.md',
    'packages/typescript-config',
    'packages/eslint-config',
    'packages/ui',
    'packages/config',
    'packages/db',
    'packages/auth',
  ];

  for (const file of filesToCopy) {
    await fs.copy(path.join(templatePath, file), path.join(projectPath, file));
  }
    spin.success('Base files copied');

    // Generate and write the starter config
    const configContent = await generateConfig(options);
    await fs.writeFile(path.join(projectPath, 'starter.config.ts'), configContent);

  spin = createSpinner('Setting up selected features');
  if (features.includes('web')) {
    await fs.copy(path.join(templatePath, 'apps/client'), path.join(projectPath, 'apps/client'));
  }

  if (features.includes('docs')) {
    await fs.copy(path.join(templatePath, 'apps/docs'), path.join(projectPath, 'apps/docs'));
  }

  if (auth?.includes('social') && options.socialProviders?.length) {
    spin = createSpinner('Configuring authentication');
    await updateAuthConfig(projectPath, options.socialProviders);
    spin.success('Authentication configured');
  }

  spin.success('Features set up successfully');

  spin = createSpinner('Configuring project');
  const pkgPath = path.join(projectPath, 'package.json');
  const pkg = await fs.readJson(pkgPath);
  pkg.name = appName.toLowerCase().replace(/\s+/g, '-');
  pkg.description = description;
  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  spin.success('Project configured');

  spin = createSpinner('Initializing Git repository');
  try {
    await execa('git', ['init'], { cwd: projectPath });
    spin.success('Git repository initialized');
  } catch (error) {
    spin.error('Failed to initialize git repository');
  }

  spin = createSpinner('Installing dependencies');
  try {
    await ensurePackageManager(packageManager);
    await installDependencies(packageManager, projectPath);
    spin.success('Dependencies installed');
  } catch (error) {
    spin.error('Failed to install dependencies');
    throw error;
  }

  return {
    projectPath,
    packageManager,
    features,
    auth,
  };
}
