/**
 * culturalPassportStyle: estilos de CulturalPassport, PassportCollection y el escáner QR.
 */

import { StyleSheet } from "react-native";

export const SCREEN_PADDING = 20;
export const GRID_GAP = 10;

const GREEN = "#0B5D2E";
const ORANGE = "#F7931E";

export const culturalPassportStyle = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: {
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: 16,
    paddingBottom: 110,
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "700",
    color: GREEN,
    textAlign: "center",
    marginBottom: 20,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: 26,
    paddingBottom: 8,
  },
  qrButtonSmall: {
    marginTop: 24,
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },

  profileRow: { flexDirection: "row", alignItems: "center" },
  avatarWrap: { width: 130, height: 130, marginRight: 18 },
  avatar: {
    width: 140,
    height: 140,
  },
  qrButton: {
    position: "absolute",
    right: -8,
    bottom: -8,
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  profileInfo: { flex: 1 },
  userName: { fontSize: 26, fontWeight: "700", color: "#111111" },
  userLevel: { fontSize: 12, fontWeight: "600", color: GREEN, marginTop: 2 },
  statsRow: { flexDirection: "row", alignItems: "center", marginTop: 14 },
  stat: { flex: 1, alignItems: "center" },
  statNumber: { fontSize: 22, fontWeight: "700", color: "#111111" },
  statLabel: { fontSize: 13, color: "#333333" },
  statDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: "#CFCFCF",
    marginHorizontal: 6,
  },

  hint: {
    textAlign: "center",
    color: "#222222",
    fontSize: 13,
    marginTop: 22,
    marginBottom: 6,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111111" },
  seeAll: { fontSize: 12, fontWeight: "600", color: ORANGE },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: GRID_GAP },
  gridSpaced: { marginTop: 12, marginBottom: 26 },

  stamp: { borderRadius: 6, overflow: "hidden", padding: 5 },
  stampLocked: {
    backgroundColor: "#ADADAD",
    alignItems: "center",
    justifyContent: "center",
  },
  lockCircle: {
    width: "46%",
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  stampImage: {
    ...StyleSheet.absoluteFillObject,
    margin: 5,
    borderRadius: 3,
    width: undefined,
    height: undefined,
  },
  stampCaption: { position: "absolute", left: 8, right: 8, bottom: 8 },
  stampTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
    lineHeight: 13,
  },
  stampLocation: {
    fontSize: 8,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 1,
  },

  // Escáner QR
  scannerRoot: { flex: 1, backgroundColor: "#000000" },
  scannerCamera: { flex: 1 },
  scannerClose: {
    position: "absolute",
    top: 54,
    left: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  scannerFrame: {
    position: "absolute",
    top: "30%",
    alignSelf: "center",
    width: 240,
    height: 240,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: ORANGE,
  },
  scannerHint: {
    position: "absolute",
    bottom: 90,
    alignSelf: "center",
    paddingHorizontal: 30,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 15,
  },
  scannerBusy: { position: "absolute", alignSelf: "center", top: "50%" },
  scannerPermission: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 20,
  },
  scannerPermissionText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },

  resultOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  resultCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    gap: 14,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: GREEN,
    textAlign: "center",
  },
  resultImage: { width: 140, height: 185, borderRadius: 8 },
  resultSubtitle: { fontSize: 15, fontWeight: "600", color: "#111111" },
  resultRetry: { color: ORANGE, fontWeight: "600", fontSize: 14 },

  primaryButton: {
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  primaryButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
});
