import { PresetSnippet } from './types';

export const PRESET_SNIPPETS: PresetSnippet[] = [
  {
    id: 'k8s-raft',
    category: 'Cloud',
    title: 'Kubernetes Raft Consensus',
    subtitle: 'Distributed state quorum & split-brain prevention',
    recommendedTone: 'executive',
    content: `etcd implements the Raft consensus algorithm for maintaining a strongly consistent, replicated key-value datastore. During network partition events, Raft enforces quorum invariants (Q = ⌊N/2⌋ + 1) to prevent split-brain anomalies. If the active leader fails to receive periodic heartbeat acknowledgments within the randomized election timeout window (150ms-300ms), candidate nodes increment the term counter and broadcast RequestVote RPCs. Only nodes with an up-to-date log matching the committed index can attain leadership, preventing phantom writes and stale reads during multi-AZ isolation events.`,
  },
  {
    id: 'transformer-lora',
    category: 'AI / ML',
    title: 'Transformer Attention & LoRA',
    subtitle: 'Multi-head QKV projections and low-rank adaptation',
    recommendedTone: 'eli5',
    content: `Scaled dot-product attention computes softmax((Q·Kᵀ)/√d_k)·V across multiple projection heads to capture polysemantic relationships across token sequences. During parameter-efficient fine-tuning (PEFT), Low-Rank Adaptation (LoRA) freezes the base model weights W₀ ∈ ℝ^{d×k} and injects trainable rank-decomposition matrices A ∈ ℝ^{r×k} and B ∈ ℝ^{d×r} where intrinsic rank r ≪ min(d,k). The modified forward pass computes h = W₀x + (α/r)BAx, drastically attenuating backpropagation gradient memory consumption while eliminating catastrophic forgetting.`,
  },
  {
    id: 'ebpf-tracing',
    category: 'DevOps',
    title: 'eBPF Kernel Probing',
    subtitle: 'In-kernel bytecode verifier & ring-buffer telemetry',
    recommendedTone: 'technical',
    content: `Extended Berkeley Packet Filter (eBPF) provides sandboxed kernel programmability without requiring out-of-tree kernel modules or patching upstream code. The kernel verifier conducts directed acyclic graph (DAG) static analysis to guarantee bounded execution, preventing infinite loops, out-of-bounds pointer arithmetic, and null-dereferences. Once validated, just-in-time (JIT) compilation emits native x86_64 instructions hooked to kprobes, tracepoints, or XDP network drivers, exporting high-throughput metrics to userspace asynchronously via memory-mapped BPF ring buffers.`,
  },
  {
    id: 'lsm-compaction',
    category: 'Databases',
    title: 'LSM-Tree Compaction',
    subtitle: 'Write-Ahead Log, MemTable flushing & Leveled compaction',
    recommendedTone: 'technical',
    content: `Log-Structured Merge-tree (LSM) architectures buffer incoming write mutations in an append-only Write-Ahead Log (WAL) and an in-memory concurrent skip-list (MemTable). Once the MemTable crosses the flush threshold, it is serialized immutably to disk as Level 0 Sorted String Tables (SSTables) with accompanying Bloom filters. Background compaction workers merge overlapping key ranges across hierarchical levels (Leveled Compaction Strategy), mitigating read amplification and reclaiming tombstoned keys at the expense of temporary I/O write amplification.`,
  },
  {
    id: 'zk-snark',
    category: 'Security',
    title: 'zk-SNARKs & Elliptic Pairings',
    subtitle: 'Zero-knowledge proofs and arithmetic circuit satisfiability',
    recommendedTone: 'eli5',
    content: `Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge (zk-SNARKs) convert general computation into Quadratic Arithmetic Programs (QAP) representing boolean and arithmetic R1CS constraint systems. Using bilinear pairings over elliptic curves (e.g. BN254 / BLS12-381), the prover generates succinct polynomial commitment proofs verifying that f(x) = y holds for a private witness w, without disclosing w itself. Verification executes in O(1) constant time with sub-millisecond cryptographic pairing checks.`,
  },
];
