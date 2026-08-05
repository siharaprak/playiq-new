import { zodResolver } from '@hookform/resolvers/zod';
import { BetaApplicationSchema } from '../src/app/(public)/beta/schema';

console.log("Schema:", BetaApplicationSchema);
try {
  const resolver = zodResolver(BetaApplicationSchema as any);
  console.log("Resolver created successfully!");
} catch (err) {
  console.error("Resolver creation failed:", err);
}
