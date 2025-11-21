"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { PlusCircle, Copy, Trash2 } from "lucide-react";

export default function AgentDashboardClient({ agent }: { agent: any }) {
  const [email, setEmail] = useState("");
  const [tokens, setTokens] = useState<any[]>([]);

  const handleGenerate = async () => {
    if (!email) {
      toast.error("Please enter a user's email.");
      return;
    }
    try {
      const res = await fetch("/api/invites", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to generate token");

      setTokens((prev) => [data, ...prev]);
      toast.success("Invitation token generated successfully!");
      setEmail("");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast.info("Token copied to clipboard");
  };

  const revokeToken = (id: string) => {
    setTokens((prev) => prev.filter((t) => t.id !== id));
    toast.warning("Token revoked");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Agent Dashboard
          </h1>
          <p className="text-gray-500">Welcome, {agent.name || agent.email}</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">Add Property</Button>
      </div>

      {/* Invitation Generator */}
      <Card className="p-4 shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <CardTitle className="text-lg font-semibold text-gray-700">
            Generate Invitation
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-3">
          <Input
            placeholder="Enter existing user's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleGenerate}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" /> Generate
          </Button>
        </CardContent>
      </Card>

      {/* Invitation List */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="text-gray-700 text-lg">
            Generated Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tokens.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No tokens yet. Generate one above.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-600">
                  <tr>
                    <th className="py-2">Email</th>
                    <th className="py-2">Token</th>
                    <th className="py-2">Expires</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.map((t) => (
                    <tr
                      key={t.id}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-2">{t.email}</td>
                      <td className="py-2 font-mono">{t.token}</td>
                      <td className="py-2">
                        {new Date(t.expiresAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToken(t.token)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => revokeToken(t.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
