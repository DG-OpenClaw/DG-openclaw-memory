import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Topic = 'IAM' | 'EC2' | 'S3' | 'VPC' | 'RDS';
type Difficulty = 'easy' | 'normal' | 'boss';
type Screen = 'home' | 'quiz' | 'review';

type Quiz = {
  id: number;
  topic: Topic;
  question: string;
  choices: string[];
  answer: number;
  explanation: string;
  difficulty: Difficulty;
  reward: number;
};

type WrongAnswer = {
  id: number;
  topic: Topic;
  question: string;
  selectedChoice: string;
  correctChoice: string;
  explanation: string;
};

type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
};

const quizzes: Quiz[] = [
  {
    id: 1,
    topic: 'IAM',
    difficulty: 'easy',
    reward: 10,
    question: 'EC2 から S3 に安全にアクセスさせたい。最も適切なのは？',
    choices: [
      'EC2 に Access Key を直接保存する',
      'IAM ロールを EC2 に付与する',
      'S3 をパブリック公開する',
      'セキュリティグループで S3 を許可する',
    ],
    answer: 1,
    explanation:
      'EC2 から AWS サービスへ安全に権限を渡すなら IAM ロールが基本。Access Key の直置きは避ける。',
  },
  {
    id: 2,
    topic: 'S3',
    difficulty: 'easy',
    reward: 10,
    question: 'S3 の主な特徴として正しいものは？',
    choices: [
      'ブロックストレージである',
      'ファイルシステムを直接マウントする前提である',
      'オブジェクトストレージで高耐久性がある',
      '必ず単一 AZ にしか置けない',
    ],
    answer: 2,
    explanation:
      'S3 はオブジェクトストレージ。EBS はブロック、EFS はファイルストレージ。',
  },
  {
    id: 3,
    topic: 'RDS',
    difficulty: 'normal',
    reward: 15,
    question: 'RDS の Multi-AZ 配置の主目的は？',
    choices: ['読み取り性能の向上', '可用性の向上', '保存容量の拡大', 'SQL 文の高速化'],
    answer: 1,
    explanation:
      'Multi-AZ は障害対策・可用性向上が目的。読み取り性能向上は Read Replica。',
  },
  {
    id: 4,
    topic: 'VPC',
    difficulty: 'normal',
    reward: 15,
    question: 'プライベートサブネットの EC2 がインターネットへアウトバウンド接続する時に必要になりやすいのは？',
    choices: ['Internet Gateway', 'NAT Gateway', 'Route 53', 'Security Hub'],
    answer: 1,
    explanation:
      'プライベートサブネットから外へ出る代表解は NAT Gateway。IGW は通常パブリック側で使う。',
  },
  {
    id: 5,
    topic: 'EC2',
    difficulty: 'normal',
    reward: 15,
    question: '短時間の中断が許容でき、最も安く計算リソースを使いたい。向いている購入オプションは？',
    choices: ['オンデマンド', 'Dedicated Host', 'スポットインスタンス', 'Savings Plans だけ'],
    answer: 2,
    explanation:
      '中断許容ならスポットが最安クラス。安定性優先ならオンデマンドや Reserved 系。',
  },
  {
    id: 6,
    topic: 'VPC',
    difficulty: 'boss',
    reward: 30,
    question: '高可用で運用負荷を抑えた Web アプリ構成として最も自然なのは？',
    choices: [
      '1台の EC2 に Web + DB を同居',
      'ALB + Auto Scaling EC2 + RDS Multi-AZ',
      'S3 に DB を置く',
      'EC2 を固定IP 1台だけにする',
    ],
    answer: 1,
    explanation:
      'SAA の王道。ALB で分散し、EC2 は Auto Scaling、DB は Multi-AZ で可用性を上げる。',
  },
];

const topics: { topic: Topic; subtitle: string; color: string; enemy: string }[] = [
  { topic: 'IAM', subtitle: '権限の土台', color: '#7c3aed', enemy: 'Policy Goblin' },
  { topic: 'EC2', subtitle: '計算リソース', color: '#2563eb', enemy: 'Compute Drake' },
  { topic: 'S3', subtitle: 'ストレージの海', color: '#059669', enemy: 'Bucket Slime' },
  { topic: 'VPC', subtitle: 'ネットワーク迷宮', color: '#ea580c', enemy: 'Subnet Hydra' },
  { topic: 'RDS', subtitle: 'DB の城', color: '#dc2626', enemy: 'Replica Wraith' },
];

const dailyMissions = [
  'IAM と ロールの違いを説明できるようにする',
  'S3 / EBS / EFS の違いを比較する',
  'Multi-AZ と Read Replica を混同しない',
  'VPC の public / private subnet を図で理解する',
  'ALB と Auto Scaling の役割を言えるようにする',
];

const levelFromExp = (exp: number) => Math.floor(exp / 40) + 1;
const expIntoLevel = (exp: number) => exp % 40;

const buildAchievements = (
  accuracy: number,
  bestCombo: number,
  wrongAnswers: WrongAnswer[],
  runScore: number,
  total: number,
): Achievement[] => [
  {
    id: 'first-clear',
    title: '初回踏破',
    description: '1回クエストを完走した',
    unlocked: true,
    icon: '🏁',
  },
  {
    id: 'combo-3',
    title: '連撃アーキテクト',
    description: '3連勝コンボを達成',
    unlocked: bestCombo >= 3,
    icon: '⚔️',
  },
  {
    id: 'perfect-clear',
    title: 'ノーミス設計士',
    description: '全問正解でクリア',
    unlocked: runScore === total,
    icon: '👑',
  },
  {
    id: 'boss-down',
    title: '高可用性ドラゴンスレイヤー',
    description: 'ボス戦に勝利した',
    unlocked: accuracy >= 60,
    icon: '🐉',
  },
  {
    id: 'review-mind',
    title: '復習の鬼',
    description: '間違いを持ち帰って次の改善点を見つけた',
    unlocked: wrongAnswers.length > 0,
    icon: '🧠',
  },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [runScore, setRunScore] = useState(0);
  const [runExp, setRunExp] = useState(0);
  const [exp, setExp] = useState(85);
  const [hearts, setHearts] = useState(3);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [streak] = useState(4);
  const [finishedTopics, setFinishedTopics] = useState<Topic[]>([]);
  const [wrongTopics, setWrongTopics] = useState<Topic[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [battleLog, setBattleLog] = useState<string[]>(['Cloud Quest 起動。']);

  const mission = useMemo(() => {
    const day = new Date().getDate();
    return dailyMissions[day % dailyMissions.length];
  }, []);

  const currentQuiz = quizzes[index];
  const total = quizzes.length;
  const progress = Math.round(((index + 1) / total) * 100);
  const playerLevel = levelFromExp(exp);
  const nextLevelProgress = Math.round((expIntoLevel(exp) / 40) * 100);
  const bossHP = Math.max(0, 100 - runScore * 16 - combo * 4);

  const startQuest = () => {
    setScreen('quiz');
    setIndex(0);
    setSelected(null);
    setRunScore(0);
    setRunExp(0);
    setHearts(3);
    setCombo(0);
    setBestCombo(0);
    setFinishedTopics([]);
    setWrongTopics([]);
    setWrongAnswers([]);
    setBattleLog(['Quest 開始。今日はクラウド迷宮を攻略する。']);
  };

  const submitAnswer = () => {
    if (selected === null) return;

    const isCorrect = selected === currentQuiz.answer;
    const rewardIfCorrect = currentQuiz.reward + combo * 2;

    setFinishedTopics((prev) =>
      prev.includes(currentQuiz.topic) ? prev : [...prev, currentQuiz.topic],
    );

    if (isCorrect) {
      const nextCombo = combo + 1;
      setRunScore((prev) => prev + 1);
      setRunExp((prev) => prev + rewardIfCorrect);
      setCombo(nextCombo);
      setBestCombo((prev) => Math.max(prev, nextCombo));
      setBattleLog((prev) => [
        `${currentQuiz.topic} を突破。+${rewardIfCorrect} EXP、${nextCombo} 連勝。`,
        ...prev,
      ]);
    } else {
      setHearts((prev) => Math.max(0, prev - 1));
      setCombo(0);
      setWrongTopics((prev) => [...prev, currentQuiz.topic]);
      setWrongAnswers((prev) => [
        ...prev,
        {
          id: currentQuiz.id,
          topic: currentQuiz.topic,
          question: currentQuiz.question,
          selectedChoice: currentQuiz.choices[selected],
          correctChoice: currentQuiz.choices[currentQuiz.answer],
          explanation: currentQuiz.explanation,
        },
      ]);
      setBattleLog((prev) => [
        `${currentQuiz.topic} で被弾。復習対象に追加。`,
        ...prev,
      ]);
    }

    if (index === total - 1) {
      setExp((prev) => prev + runExp + (isCorrect ? rewardIfCorrect : 0));
      setScreen('review');
      return;
    }

    setIndex((prev) => prev + 1);
    setSelected(null);
  };

  const accuracy = Math.round((runScore / total) * 100);
  const focusTopic = wrongTopics[0] ?? 'VPC';
  const focusEnemy = topics.find((item) => item.topic === focusTopic)?.enemy ?? 'Cloud Beast';
  const rank = accuracy >= 90 ? 'S' : accuracy >= 75 ? 'A' : accuracy >= 60 ? 'B' : 'C';
  const achievements = buildAchievements(accuracy, bestCombo, wrongAnswers, runScore, total);
  const unlockedCount = achievements.filter((item) => item.unlocked).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        {screen === 'home' && (
          <>
            <Text style={styles.eyebrow}>AWS SAA 学習 RPG</Text>
            <Text style={styles.title}>Cloud Quest</Text>
            <Text style={styles.subtitle}>
              ただの問題集じゃなく、毎日ちょっと進めたくなる感じに寄せた MVP。
            </Text>

            <View style={styles.playerCard}>
              <View>
                <Text style={styles.playerLabel}>アーキテクト見習い</Text>
                <Text style={styles.playerLevel}>Lv. {playerLevel}</Text>
              </View>
              <View style={styles.streakPill}>
                <Text style={styles.streakText}>🔥 {streak}日連続</Text>
              </View>
            </View>

            <View style={styles.progressBox}>
              <View style={styles.progressHeader}>
                <Text style={styles.sectionTitle}>次のレベルまで</Text>
                <Text style={styles.progressPercent}>{nextLevelProgress}%</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${nextLevelProgress}%` }]} />
              </View>
              <Text style={styles.progressHint}>{40 - expIntoLevel(exp)} EXP でレベルアップ</Text>
            </View>

            <View style={styles.heroCard}>
              <Text style={styles.heroLabel}>今日のデイリークエスト</Text>
              <Text style={styles.heroMission}>{mission}</Text>
              <Text style={styles.heroHint}>10分でも進んだら勝ち。ゼロより一歩が強い。</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>クラウド大陸マップ</Text>
              {topics.map((item, idx) => (
                <View key={item.topic} style={styles.topicRow}>
                  <View style={[styles.topicBadge, { backgroundColor: item.color }]}>
                    <Text style={styles.topicBadgeText}>{idx + 1}</Text>
                  </View>
                  <View style={styles.topicTextWrap}>
                    <Text style={styles.topicTitle}>{item.topic}</Text>
                    <Text style={styles.topicSubtitle}>{item.subtitle} / 敵: {item.enemy}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>アチーブメント棚</Text>
              {achievements.map((item) => (
                <View key={item.id} style={[styles.achievementRow, !item.unlocked && styles.achievementLocked]}>
                  <Text style={styles.achievementIcon}>{item.icon}</Text>
                  <View style={styles.topicTextWrap}>
                    <Text style={styles.topicTitle}>{item.title}</Text>
                    <Text style={styles.topicSubtitle}>{item.description}</Text>
                  </View>
                  <Text style={item.unlocked ? styles.unlockText : styles.lockText}>
                    {item.unlocked ? 'UNLOCK' : 'LOCKED'}
                  </Text>
                </View>
              ))}
            </View>

            <Pressable style={styles.primaryButton} onPress={startQuest}>
              <Text style={styles.primaryButtonText}>クエスト開始</Text>
            </Pressable>
          </>
        )}

        {screen === 'quiz' && (
          <>
            <View style={styles.quizTopBar}>
              <Text style={styles.eyebrow}>Quest {index + 1} / {total}</Text>
              <Text style={styles.hearts}>❤️ {hearts}</Text>
            </View>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>進捗 {progress}%</Text>
              <Text style={styles.progressText}>Combo x{combo}</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>

            {currentQuiz.difficulty === 'boss' && (
              <View style={styles.bossCard}>
                <Text style={styles.bossLabel}>BOSS</Text>
                <Text style={styles.bossName}>Availability Dragon</Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.bossHpFill, { width: `${bossHP}%` }]} />
                </View>
                <Text style={styles.progressHint}>高可用アーキテクチャを組め。HP {bossHP}%</Text>
              </View>
            )}

            <View style={styles.quizCard}>
              <Text style={styles.quizMeta}>
                {currentQuiz.topic} / {currentQuiz.difficulty} / 報酬 {currentQuiz.reward} EXP
              </Text>
              <Text style={styles.quizQuestion}>{currentQuiz.question}</Text>

              {currentQuiz.choices.map((choice, choiceIndex) => {
                const active = selected === choiceIndex;
                return (
                  <Pressable
                    key={choice}
                    onPress={() => setSelected(choiceIndex)}
                    style={[styles.choiceButton, active && styles.choiceButtonActive]}
                  >
                    <Text style={[styles.choiceText, active && styles.choiceTextActive]}>{choice}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.explanationCard}>
              <Text style={styles.explanationTitle}>攻略メモ</Text>
              <Text style={styles.explanationText}>{currentQuiz.explanation}</Text>
            </View>

            <Pressable
              style={[styles.primaryButton, selected === null && styles.buttonDisabled]}
              onPress={submitAnswer}
              disabled={selected === null}
            >
              <Text style={styles.primaryButtonText}>
                {index === total - 1 ? 'ボス撃破判定へ' : '次の敵へ'}
              </Text>
            </Pressable>
          </>
        )}

        {screen === 'review' && (
          <>
            <Text style={styles.eyebrow}>Quest Result</Text>
            <View style={styles.resultHeader}>
              <Text style={styles.title}>Rank {rank}</Text>
              <Text style={styles.resultExp}>+{runExp} EXP</Text>
            </View>
            <Text style={styles.subtitle}>
              {runScore} / {total} 正解。コンボ最高 {bestCombo}。復習しやすさと達成感を足した。
            </Text>

            <View style={styles.heroCard}>
              <Text style={styles.heroLabel}>次の討伐対象</Text>
              <Text style={styles.heroMission}>{focusTopic} / {focusEnemy}</Text>
              <Text style={styles.heroHint}>
                苦手を「次の敵」に見立てると、復習がただの反省会じゃなくなる。
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>アンロックしたアチーブメント ({unlockedCount}/{achievements.length})</Text>
              {achievements.map((item) => (
                <View key={item.id} style={[styles.achievementRow, !item.unlocked && styles.achievementLocked]}>
                  <Text style={styles.achievementIcon}>{item.icon}</Text>
                  <View style={styles.topicTextWrap}>
                    <Text style={styles.topicTitle}>{item.title}</Text>
                    <Text style={styles.topicSubtitle}>{item.description}</Text>
                  </View>
                  <Text style={item.unlocked ? styles.unlockText : styles.lockText}>
                    {item.unlocked ? 'UNLOCK' : 'LOCKED'}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>間違えた問題の復習帳</Text>
              {wrongAnswers.length === 0 ? (
                <Text style={styles.bullet}>• 今回はノーミス。復習帳は空。</Text>
              ) : (
                wrongAnswers.map((item) => (
                  <View key={item.id} style={styles.reviewCard}>
                    <Text style={styles.reviewTopic}>{item.topic}</Text>
                    <Text style={styles.reviewQuestion}>{item.question}</Text>
                    <Text style={styles.reviewLine}>あなたの回答: {item.selectedChoice}</Text>
                    <Text style={styles.reviewLine}>正解: {item.correctChoice}</Text>
                    <Text style={styles.reviewExplanation}>{item.explanation}</Text>
                  </View>
                ))
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>バトルログ</Text>
              {battleLog.slice(0, 5).map((log, idx) => (
                <Text key={`${log}-${idx}`} style={styles.bullet}>• {log}</Text>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>今回進んだ分野</Text>
              {finishedTopics.map((topic) => (
                <Text key={topic} style={styles.bullet}>• {topic}</Text>
              ))}
            </View>

            <Pressable style={styles.primaryButton} onPress={() => setScreen('home')}>
              <Text style={styles.primaryButtonText}>ホームへ戻る</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0b1020',
  },
  container: {
    padding: 20,
    paddingBottom: 48,
    gap: 16,
  },
  eyebrow: {
    color: '#7dd3fc',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: '#f8fafc',
    fontSize: 34,
    fontWeight: '800',
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 16,
    lineHeight: 24,
  },
  playerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111833',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1e2a52',
  },
  playerLabel: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
  },
  playerLevel: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '800',
  },
  streakPill: {
    backgroundColor: '#3f1d0d',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#7c2d12',
  },
  streakText: {
    color: '#fdba74',
    fontWeight: '800',
  },
  progressBox: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 10,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  progressPercent: {
    color: '#7dd3fc',
    fontWeight: '700',
  },
  progressHint: {
    color: '#94a3b8',
    fontSize: 13,
  },
  heroCard: {
    backgroundColor: '#111833',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1e2a52',
    gap: 8,
  },
  heroLabel: {
    color: '#7dd3fc',
    fontWeight: '700',
    fontSize: 14,
  },
  heroMission: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 30,
  },
  heroHint: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 10,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  topicBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicBadgeText: {
    color: '#fff',
    fontWeight: '800',
  },
  topicTextWrap: {
    flex: 1,
  },
  topicTitle: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '700',
  },
  topicSubtitle: {
    color: '#94a3b8',
    fontSize: 13,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#111833',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1e2a52',
  },
  achievementLocked: {
    opacity: 0.55,
  },
  achievementIcon: {
    fontSize: 24,
  },
  unlockText: {
    color: '#86efac',
    fontWeight: '800',
    fontSize: 12,
  },
  lockText: {
    color: '#94a3b8',
    fontWeight: '800',
    fontSize: 12,
  },
  bullet: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: '#38bdf8',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#082f49',
    fontSize: 16,
    fontWeight: '800',
  },
  quizTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hearts: {
    color: '#fecaca',
    fontSize: 16,
    fontWeight: '800',
  },
  progressText: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  progressBarBg: {
    width: '100%',
    height: 10,
    backgroundColor: '#1e293b',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#38bdf8',
    borderRadius: 999,
  },
  bossCard: {
    backgroundColor: '#2a1020',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#7f1d1d',
    gap: 8,
  },
  bossLabel: {
    color: '#fca5a5',
    fontWeight: '800',
    letterSpacing: 1,
  },
  bossName: {
    color: '#fff1f2',
    fontSize: 22,
    fontWeight: '800',
  },
  bossHpFill: {
    height: '100%',
    backgroundColor: '#ef4444',
    borderRadius: 999,
  },
  quizCard: {
    backgroundColor: '#111833',
    borderRadius: 20,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: '#1e2a52',
  },
  quizMeta: {
    color: '#7dd3fc',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  quizQuestion: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 30,
  },
  choiceButton: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#24314f',
    padding: 14,
  },
  choiceButtonActive: {
    borderColor: '#38bdf8',
    backgroundColor: '#082f49',
  },
  choiceText: {
    color: '#e2e8f0',
    fontSize: 15,
    lineHeight: 22,
  },
  choiceTextActive: {
    color: '#e0f2fe',
    fontWeight: '700',
  },
  explanationCard: {
    backgroundColor: '#172036',
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  explanationTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  explanationText: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 21,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  resultExp: {
    color: '#86efac',
    fontSize: 20,
    fontWeight: '800',
  },
  reviewCard: {
    backgroundColor: '#111833',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e2a52',
    gap: 6,
  },
  reviewTopic: {
    color: '#7dd3fc',
    fontWeight: '800',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  reviewQuestion: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  reviewLine: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
  },
  reviewExplanation: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 19,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
});
