# Sorgenti delle guide

Una cartella per guida, con lo stesso nome dello slug. Ogni cartella ha un `NOTES.md` con le decisioni prese su quella guida. Le guide con sorgenti propri (manuale-ai, machine-learning, comandi-bash) si rigenerano con `python3 build.py` dalla loro cartella; le altre si modificano direttamente in `docs/<slug>.html`. Le istruzioni generali sono in `CLAUDE.md` alla radice.
