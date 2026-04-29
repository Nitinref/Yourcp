"use client";

import * as React from "react";
import { CheckCircle2, Link2, RefreshCcw, Save, Trash2 } from "lucide-react";
import { connectablePlatforms, platformColors, platformSyncSupport } from "@/constants/platforms";
import { predefinedTopics } from "@/constants/topics";
import { useToast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlatformAccount, PlatformAccountPayload, SyncResult } from "@/types";

async function request<T>(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  const data = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(data.error ?? "Request failed.");
  }
  return data;
}

export function PlatformAccountsSection() {
  const { toast } = useToast();
  const [accounts, setAccounts] = React.useState<PlatformAccount[]>([]);
  const [handles, setHandles] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(true);
  const [busyKey, setBusyKey] = React.useState<string | null>(null);

  const loadAccounts = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await request<PlatformAccount[]>("/api/platform-accounts");
      setAccounts(data);
      setHandles(
        data.reduce<Record<string, string>>((acc, account) => {
          acc[account.platform] = account.handle;
          return acc;
        }, {})
      );
    } catch (error) {
      toast({
        title: "Accounts unavailable",
        description: error instanceof Error ? error.message : "Unable to load platform accounts.",
        variant: "error"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    void loadAccounts();
  }, [loadAccounts]);

  const saveAccount = async (platform: PlatformAccountPayload["platform"]) => {
    const handle = handles[platform]?.trim();
    if (!handle) {
      toast({
        title: "Handle required",
        description: `Add your ${platform} handle before saving.`,
        variant: "error"
      });
      return;
    }

    try {
      setBusyKey(`save-${platform}`);
      const saved = await request<PlatformAccount>("/api/platform-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, handle })
      });
      setAccounts((current) => {
        const others = current.filter((item) => item.platform !== platform);
        return [...others, saved].sort((a, b) => a.platform.localeCompare(b.platform));
      });
      toast({
        title: `${platform} connected`,
        description:
          platformSyncSupport[platform] === "official"
            ? "You can sync solved problems from this platform."
            : "Handle saved. Automatic sync for this platform is planned next.",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Unable to save platform account.",
        variant: "error"
      });
    } finally {
      setBusyKey(null);
    }
  };

  const deleteAccount = async (accountId: string, platform: string) => {
    try {
      setBusyKey(`delete-${accountId}`);
      await request<{ success: true }>(`/api/platform-accounts/${accountId}`, {
        method: "DELETE"
      });
      setAccounts((current) => current.filter((item) => item.id !== accountId));
      toast({
        title: `${platform} removed`,
        description: "The saved handle was removed from your account.",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Remove failed",
        description: error instanceof Error ? error.message : "Unable to remove platform account.",
        variant: "error"
      });
    } finally {
      setBusyKey(null);
    }
  };

  const syncAccount = async (accountId: string, platform: string) => {
    try {
      setBusyKey(`sync-${accountId}`);
      const result = await request<SyncResult>(`/api/platform-accounts/${accountId}/sync`, {
        method: "POST"
      });
      await loadAccounts();
      toast({
        title: `${platform} sync finished`,
        description: `${result.message} Imported ${result.importedCount}, updated ${result.updatedCount}.`,
        variant: "success"
      });
    } catch (error) {
      toast({
        title: `${platform} sync failed`,
        description: error instanceof Error ? error.message : "Unable to sync this platform right now.",
        variant: "error"
      });
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr,0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle>Connect Platforms</CardTitle>
          <CardDescription>
            Save your competitive programming handles here. All platforms now support automatic sync to import your solved problems!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? <p className="text-sm text-slate-400">Loading platform accounts...</p> : null}
          {connectablePlatforms.map((platform) => {
            const account = accounts.find((item) => item.platform === platform);
            const support = platformSyncSupport[platform];

            return (
              <div
                key={platform}
                className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className={platformColors[platform]}>{platform}</Badge>
                    <Badge
                      className={
                        support === "official"
                          ? "border-zinc-500/20 bg-zinc-300/10 text-zinc-200"
                          : "border-zinc-500/20 bg-zinc-300/10 text-zinc-200"
                      }
                    >
                      {support === "official" ? "✓ Sync Enabled" : "Coming Soon"}
                    </Badge>
                  </div>
                  {account?.profileUrl ? (
                    <a
                      href={account.profileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-zinc-200 transition hover:text-zinc-300"
                    >
                      Open profile
                    </a>
                  ) : null}
                </div>

                <div className="flex flex-col gap-3 md:flex-row">
                  <input
                    value={handles[platform] ?? account?.handle ?? ""}
                    onChange={(event) =>
                      setHandles((current) => ({
                        ...current,
                        [platform]: event.target.value
                      }))
                    }
                    placeholder={`Add your ${platform} username`}
                    className="h-11 flex-1 rounded-xl border border-slate-800 bg-slate-950/80 px-3 text-sm text-slate-100"
                  />
                  <Button
                    variant="outline"
                    onClick={() => void saveAccount(platform)}
                    disabled={busyKey === `save-${platform}`}
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                  <Button
                    onClick={() => account && void syncAccount(account.id, platform)}
                    disabled={!account || busyKey === `sync-${account?.id}`}
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Sync
                  </Button>
                  {account ? (
                    <Button
                      variant="ghost"
                      onClick={() => void deleteAccount(account.id, platform)}
                      disabled={busyKey === `delete-${account.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  ) : null}
                </div>

                {account ? (
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-zinc-200" />
                      Status: {account.syncStatus}
                    </span>
                    <span>
                      Last synced: {account.lastSyncedAt ? new Date(account.lastSyncedAt).toLocaleString() : "Never"}
                    </span>
                    {account.lastError ? <span className="text-zinc-200">Last error: {account.lastError}</span> : null}
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-slate-500">
                    Save your handle first. Click Sync to import solved problems from {platform} automatically!
                  </p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Topic Library</CardTitle>
          <CardDescription>
            Questions now use a predefined topic set so imported and manual entries stay consistent across filters, stats, and exports.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {predefinedTopics.map((topic) => (
            <Badge
              key={topic}
              className="border-slate-700 bg-slate-800/80 text-slate-200"
            >
              <Link2 className="mr-1 h-3 w-3" />
              {topic}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
