import fs from 'fs-extra';
import path from 'path';
import { execa } from 'execa';
import type { CreateAppOptions } from './types.js';
import { ensurePackageManager, getPackageManagerVersion, installDependencies } from './utils.js';
import { createSpinner } from './spinner.js';
import { updateAuthConfig } from './auth-config.js';
import { generateConfig } from './config.js';

export async function createApp(options: CreateAppOptions) {
  const { projectPath, appName, description, features, auth, packageManager } = options;
  const templatePath = path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    '../../..'
  );

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

  const filterFunc = (src: string) => {
    const base = path.basename(src);
    return base !== 'node_modules' && base !== '.next';
  };

  try {
    for (const file of filesToCopy) {
      const sourcePath = path.join(templatePath, file);
      const targetPath = path.join(projectPath, file);
      
      if (!await fs.pathExists(sourcePath)) {
        throw new Error(`Source file not found: ${sourcePath}`);
      }
      
      await fs.copy(sourcePath, targetPath, { filter: filterFunc });
    }
    spin.success('Base files copied');
  } catch (error) {
    spin.error('Failed to copy base files');
    if (error instanceof Error) {
      throw new Error(`Failed to copy files: ${error.message}`);
    }
    throw error;
  }

    // Generate and write the starter config
    const configContent = await generateConfig(options);
    await fs.writeFile(path.join(projectPath, 'starter.config.ts'), configContent);

  spin = createSpinner('Setting up selected features');

  if (features.includes('web')) {
    await fs.copy(
      path.join(templatePath, 'apps/client'), 
      path.join(projectPath, 'apps/client'),
      { filter: filterFunc }
    );
  }

  if (features.includes('docs')) {
    await fs.copy(
      path.join(templatePath, 'apps/docs'), 
      path.join(projectPath, 'apps/docs'),
      { filter: filterFunc }
    );
  }
  
  spin.success('Features set up successfully');

  if (auth?.includes('social') && options.socialProviders?.length) {
    spin = createSpinner('Configuring authentication');
    await updateAuthConfig(projectPath, options.socialProviders);
    spin.success('Authentication configured');
  }


  spin = createSpinner('Configuring project');
  try {
    const pkgPath = path.join(projectPath, 'package.json');
    
    const pkg = await fs.readJson(pkgPath);
    if (!pkg) {
      throw new Error('Failed to read package.json - file is empty or invalid');
    }

    pkg.name = appName.toLowerCase().replace(/\s+/g, '-');
    pkg.description = description || '';

    // Update package manager specific scripts
    const execPrefix = {
      npm: 'npx',
      pnpm: 'pnpm',
      yarn: 'yarn',
      bun: 'bunx'
    }[packageManager];

    // Update scripts that use package manager specific commands
    if (pkg.scripts) {
      Object.keys(pkg.scripts).forEach(scriptName => {
        if (pkg.scripts[scriptName].includes('bunx')) {
          pkg.scripts[scriptName] = pkg.scripts[scriptName].replace('bunx', execPrefix);
        } else if (pkg.scripts[scriptName].includes('npx')) {
          pkg.scripts[scriptName] = pkg.scripts[scriptName].replace('npx', execPrefix);
        }
      });
    }

    // Update packageManager field
    const version = await getPackageManagerVersion(packageManager);
    pkg.packageManager = `${packageManager}@${version}`;
    
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    spin.success('Project configured');
  } catch (error) {
    spin.error('Failed to configure project');
    if (error instanceof Error) {
      throw new Error(`Failed to update package.json: ${error.message}`);
    }
    throw error;
  }

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
