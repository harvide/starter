import fs from 'fs-extra';
import path from 'path';
import { execa } from 'execa';
import type { CreateAppOptions, LLMType } from './types.js';
import { ensurePackageManager, getPackageManagerVersion, installDependencies } from './utils.js';
import { createSpinner } from './spinner.js';
import { updateAuthConfig } from './auth-config.js';
import { generateConfig } from './config.js';

async function copyLLMRules(projectPath: string, templatePath: string, llm: LLMType) {
  const llmRuleMap = {
    claude: [
      { source: '.claude/CLAUDE.md', target: '.claude/CLAUDE.md' },
    ],
    cursor: [
      { source: '.cursor/rules/ultracite.mdc', target: '.cursor/rules/ultracite.mdc' },
    ],
    windsurf: [
      { source: '.windsurf/rules/ultracite.md', target: '.windsurf/rules/ultracite.md' },
    ],
    copilot: [
      { source: '.github/copilot-instructions.md', target: '.github/copilot-instructions.md' },
    ],
    zed: [
      { source: '.rules', target: '.rules' },
    ],
    codex: [
      { source: 'AGENTS.md', target: 'AGENTS.md' },
    ],
    none: []
  };

  const rulesToCopy = llmRuleMap[llm];

  if (rulesToCopy.length > 0) {
    const spin = createSpinner(`Copying ${llm} LLM rules`);
    try {
      for (const rule of rulesToCopy) {
        const sourcePath = path.join(templatePath, rule.source);
        const targetPath = path.join(projectPath, rule.target);
        await fs.ensureDir(path.dirname(targetPath)); // Ensure target directory exists
        await fs.copy(sourcePath, targetPath);
      }
      spin.success(`${llm} LLM rules copied`);
    } catch (error) {
      spin.error(`Failed to copy ${llm} LLM rules`);
      if (error instanceof Error) {
        throw new Error(`Failed to copy LLM rules: ${error.message}`);
      }
      throw error;
    }
  }
}

export async function createApp(options: CreateAppOptions) {
  const { projectPath, appName, description, features, auth, packageManager, llm } = options;
  const templatePath = path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    './template'
  );

  let spin = createSpinner('Creating project directory');
  await fs.ensureDir(projectPath);
  spin.success('Project directory created');

  spin = createSpinner('Copying base files');
  const filesToCopy = [
    'gitignore',
    'turbo.json',
    'bun.lock',
    'package.json',
    'README.md',
    'packages/typescript-config',
    'packages/eslint-config',
    'packages/ui',
    'packages/config',
    'packages/db',
    'packages/mail',
    'packages/auth',
    'starter.config.ts', // Add starter.config.ts to filesToCopy
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

    // Rename gitignore to .gitignore if it exists
    const gitignorePath = path.join(projectPath, 'gitignore');
    const dotGitignorePath = path.join(projectPath, '.gitignore');

    if (await fs.pathExists(gitignorePath)) {
      await fs.rename(gitignorePath, dotGitignorePath);
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

  // Copy LLM specific rules
  if (llm && llm !== 'none') {
    await copyLLMRules(projectPath, templatePath, llm);
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
