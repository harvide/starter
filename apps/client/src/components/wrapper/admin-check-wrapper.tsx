'use client';

import { checkAdminsExist } from '@repo/ui/components/auth/admin-signup-form/flows';
import { Button } from '@repo/ui/components/button';
import Link from 'next/link';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function AdminCheckWrapper() {
  useEffect(() => {
    async function run() {
      const res = await checkAdminsExist();
      if (res?.error || res.exists) {
        return;
      }

      if (window.location.pathname === '/admin/signin') {
        return;
      }

      setTimeout(() => {
        toast.warning('No Admin Account Found', {
          description: (
            <>
              Please create the first admin account at{' '}
              <Button
                asChild
                className="m-0 h-auto gap-0 p-0 font-normal"
                size="sm"
                variant="link"
              >
                <Link href="/admin/signin">/admin/signin</Link>
              </Button>
            </>
          ),
        });
      }, 100);
    }

    run();
  }, []);

  return null;
}
