import torch

has_mps = getattr(torch.backends, "mps", None)
mps_available = bool(has_mps and has_mps.is_available())

print("Torch version:", torch.__version__)
print("MPS available:", mps_available)
print("Device:", "mps" if mps_available else "cpu")
